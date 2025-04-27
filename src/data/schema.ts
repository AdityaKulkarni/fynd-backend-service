import z from "zod";

export const UserRequestSchema = z.object({
    productQuery: z.string().describe("Product search query"),
    priceBudget: z.number().describe("Price budget in currency"),
});

export const UserResponseSchema = z.object({
    recommendations: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        images: z.array(z.string()),
        reviews: z.array(z.object({
            id: z.string(),
            userId: z.string(),
            rating: z.number(),
            comment: z.string(),
        })),
    })),
});

