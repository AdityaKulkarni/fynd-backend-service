import { z } from "zod";
import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";
import { CardUIBuilder, TableUIBuilder } from "@dainprotocol/utils";
import ai, { instructions } from "./gemini/gemini";
import ProductModel from "./ProductModel";

const getProductRecommendationsConfig: ToolConfig = {
    id: "get-product-recommendations",
    name: "Get Product Recommendations",
    description: "Get product recommendations based on query and budget",
    input: z
        .object({
            productQuery: z.string().describe("Product search query"),
            priceBudget: z.number().describe("Price budget in currency"),
        })
        .describe("Input parameters for product recommendations"),
    output: z
        .object({
            recommendations: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    price: z.number(),
                    description: z.string(),
                    images: z.array(z.string()),
                    reviews: z.array(
                        z.object({
                            id: z.string(),
                            userId: z.string(),
                            rating: z.number(),
                            comment: z.string(),
							date: z.string(),
                        })
                    ),
                })
            ),
        })
        .describe("Product recommendations"),
    pricing: { pricePerUse: 0, currency: "USD" },
    handler: async ({ productQuery, priceBudget }, agentInfo, context) => {
        console.log(
            `User / Agent ${agentInfo.id} requested product recommendations for "${productQuery}" with budget ${priceBudget}`
        );

		console.log("productQuery", productQuery);
		console.log("priceBudget", priceBudget);

        const chat = ai.chats.create({
            model: "gemini-1.5-pro",
			config:{
				systemInstruction: instructions
			},
            history: [
                {
                    role: "user",
                    parts: [
						{
							text: `find ${productQuery} within ${priceBudget}. Match based on name, description and attributes.`,
						},
					],
				},
            ],
        });

        try {
            const response = await chat.sendMessage({
                message: `Find products in the price range of ${priceBudget}`,
            });

            console.log("gemini response", JSON.stringify(response.candidates));

            const recommendations = JSON.parse(
                response.candidates[0].content.parts[0].text.replace("```json", "").replace("```", "")
            );

			console.log("recommendations", recommendations);

            return {
                text: `Found ${recommendations.length} product recommendations for "${productQuery}" within your budget`,
                data: {
                    recommendations,
                },
                ui: new CardUIBuilder()
                    .setRenderMode("page")
                    .title(`Product Recommendations for "${productQuery}"`)
                    .addChild(
                        new TableUIBuilder()
                            .addColumns([
                                {
                                    key: "name",
                                    header: "Product Name",
                                    type: "string",
                                },
                                {
                                    key: "price",
                                    header: "Price",
                                    type: "number",
                                },
                                {
                                    key: "description",
                                    header: "Description",
                                    type: "string",
                                },
                                {
                                    key: "rating",
                                    header: "Average Rating",
                                    type: "number",
                                },
                            ])
                            .rows(
                                recommendations.map(
                                    (product: ProductModel) => ({
                                        name: product.name,
                                        price: product.price,
                                        description: product.description,
                                        rating:
                                            product.reviews.reduce(
                                                (acc, review) =>
                                                    acc + review.rating,
                                                0
                                            ) / product.reviews.length,
                                    })
                                )
                            )
                            .build()
                    )
                    .build(),
            };
        } catch (error) {
            console.error(error);
            return {
                text: `Error getting product recommendations: ${error.message}`,
                data: {
                    recommendations: [],
                },
                ui: null,
            };
        }
    },
};

const productDainService = defineDAINService({
    metadata: {
        title: "Product Recommendation DAIN Service",
        description:
            "A DAIN service for product recommendations using Gemini AI",
        version: "1.0.0",
        author: "Your Name",
        tags: ["products", "recommendations", "dain"],
        logo: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    },
    exampleQueries: [
        {
            category: "Products",
            queries: [
                "Find wireless headphones under $200",
                "Recommend a smartwatch under $150",
                "Show me coffee makers under $300",
            ],
        },
    ],
    identity: {
        apiKey: process.env.DAIN_API_KEY,
    },
    tools: [getProductRecommendationsConfig],
});

export default productDainService;
