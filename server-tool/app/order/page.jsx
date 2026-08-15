"use client";

import { useEffect, useState } from "react";
import { generateMenuRecommendations } from "@/app/actions/recommendMenu";

export default function OrderPage() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        setLoadingHistory(true);
        setError("");

        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load menu history.");
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        const names = Array.isArray(data)
          ? data
              .map((item) =>
                typeof item?.name === "string" ? item.name.trim() : ""
              )
              .filter(Boolean)
          : [];

        setOrderHistory(names);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError.message || "Could not load menu history.");
      } finally {
        if (active) {
          setLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  async function handleGenerateRecommendations() {
    try {
      setLoadingRecommendations(true);
      setError("");

      const result = await generateMenuRecommendations(orderHistory);

      if (!result.ok) {
        throw new Error(result.error || "Could not generate recommendations.");
      }

      setRecommendations(result.data.recommendations || []);
    } catch (generateError) {
      setRecommendations([]);
      setError(
        generateError.message || "Could not generate recommendations right now."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  }

  const hasHistory = orderHistory.length > 0;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Order Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Generate menu suggestions based on previous ordered items.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-6">
        {loadingHistory ? (
          <p className="text-sm text-muted-foreground">Loading order history...</p>
        ) : hasHistory ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Previous Items</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {orderHistory.join(", ")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateRecommendations}
              disabled={loadingRecommendations}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingRecommendations
                ? "Generating recommendations..."
                : "Generate Recommendations"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add menu items first so the app has order history to learn from.
          </p>
        )}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive-foreground">
          {error}
        </div>
      ) : null}

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Recommended Items</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((item, index) => (
              <article
                key={`${item.itemName}-${index}`}
                className="rounded-xl border border-border/80 bg-card p-4"
              >
                <h3 className="text-lg font-semibold">{item.itemName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Category: {item.category} • Mood: {item.mood}
                </p>
                <p className="mt-2 text-sm font-medium text-accent">
                  Because they ordered {item.basedOn}
                </p>
                <p className="mt-2 text-sm text-foreground/90">{item.reason}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {item.priceHint}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
