"use server";

import { generateText, Output } from "ai";
import { groqModels } from "@/lib/groq";
import menuRecommendationSchema from "@/lib/schemas/menu-recommendation";

const SYSTEM_PROMPT = [
  "You are a menu recommendation assistant for a restaurant.",
  "Return 3 to 5 recommendations that match the required schema.",
  "Never recommend an item that already appears in the user's order history.",
  "Each recommendation must include basedOn and it must point to one specific item from the user's order history.",
  "Return structured data only.",
].join(" ");

const MAX_ATTEMPTS = 3;

function normalizeHistory(orderHistory) {
  if (!Array.isArray(orderHistory)) {
    return [];
  }

  return orderHistory
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object" && typeof item.name === "string") {
        return item.name.trim();
      }

      return "";
    })
    .filter(Boolean);
}

function isUnsupportedOutputOption(error, optionName) {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes(optionName) &&
    (message.includes("unknown") ||
      message.includes("unexpected") ||
      message.includes("not allowed") ||
      message.includes("invalid"))
  );
}

function validateRecommendationData(data, orderHistory) {
  const historyLower = new Set(orderHistory.map((item) => item.toLowerCase()));

  const recommendations = data.recommendations.map((rec) => {
    const basedOnMatch = orderHistory.find(
      (item) => item.toLowerCase() === rec.basedOn.toLowerCase()
    );

    if (!basedOnMatch) {
      throw new Error(
        "Validation failed: basedOn must match one specific item from the order history"
      );
    }

    if (historyLower.has(rec.itemName.toLowerCase())) {
      throw new Error(
        "Validation failed: recommended item cannot already exist in order history"
      );
    }

    return {
      ...rec,
      basedOn: basedOnMatch,
    };
  });

  return {
    recommendations,
  };
}

async function generateWithCompatibleOutput({ prompt }) {
  const commonConfig = {
    model: groqModels("openai/gpt-oss-20b"),
    system: SYSTEM_PROMPT,
    prompt,
    maxRetries: 0,
    maxOutputTokens: 2500,
    providerOptions: {
      groq: {
        reasoningEffort: "low",
      },
    },
  };

  try {
    const result = await generateText({
      ...commonConfig,
      output: Output.object({
        schema: menuRecommendationSchema,
      }),
    });

    if (!result.output) {
      throw new Error("Model response did not include structured output");
    }

    return result.output;
  } catch (error) {
    if (!isUnsupportedOutputOption(error, "output")) {
      throw error;
    }
  }

  const result = await generateText({
    ...commonConfig,
    experimental_output: Output.object({
      schema: menuRecommendationSchema,
    }),
  });

  if (!result.experimental_output) {
    throw new Error("Model response did not include structured output");
  }

  return result.experimental_output;
}

export async function generateMenuRecommendations(orderHistory) {
  const normalizedHistory = normalizeHistory(orderHistory);

  if (normalizedHistory.length === 0) {
    return {
      ok: false,
      error: "Add at least one previous order item before requesting recommendations.",
    };
  }

  let retryInstruction = "";
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const prompt = `The user previously ordered these menu items:\n${JSON.stringify(
        normalizedHistory,
        null,
        2
      )}\n${retryInstruction}`.trim();

      const structuredOutput = await generateWithCompatibleOutput({
        prompt,
      });

      const data = validateRecommendationData(structuredOutput, normalizedHistory);

      return {
        ok: true,
        data,
      };
    } catch (error) {
      lastError = error;
      retryInstruction =
        "Your previous response failed validation. Return only valid structured output that matches the schema exactly.";
    }
  }

  return {
    ok: false,
    error:
      lastError?.message ||
      "Unable to generate recommendations right now. Please try again.",
  };
}