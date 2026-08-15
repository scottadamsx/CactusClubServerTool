import { z } from "zod";

export const menuRecommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        itemName: z
          .string()
          .min(1)
          .describe("The name of the recommended menu item"),
        category: z
          .string()
          .min(1)
          .describe("The menu category for the item, such as appetizer, entree, dessert, or drink"),
        mood: z
          .string()
          .min(1)
          .regex(/^[A-Za-z ]+$/)
          .describe("The dining vibe this item fits using only letters and spaces, such as comfort, fresh, rich, or celebratory"),
        basedOn: z
          .string()
          .min(1)
          .describe(
            "The exact name of one previously ordered menu item that influenced this recommendation"
          ),
        reason: z
          .string()
          .min(1)
          .describe("A short explanation of why this item fits the guest based on their order history"),
        priceHint: z
          .string()
          .min(1)
          .describe("A short price signal such as budget friendly, mid range, or premium"),
      })
    )
    .min(3)
    .max(5)
    .describe("An array of 3 to 5 menu recommendations tailored to the guest's order history"),
});

export default menuRecommendationSchema;