import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";
import { responseBasedOnApiData } from "../gemini/gemini";
import checkoutProductConfig from "./CheckoutTool";
import { beerData } from "../data/api";
import { UserRequestSchema, UserResponseSchema } from "../data/schema";
import CardGrid from "../UiBuilder";
const getProductRecommendationsConfig: ToolConfig = {
    id: "get-product-recommendations",
    name: "Get Product Recommendations",
    description: "Get product recommendations based on query and budget",
    input: UserRequestSchema,
    output: UserResponseSchema,
    pricing: { pricePerUse: 0, currency: "USD" },
    handler: async ({ productQuery, priceBudget }, agentInfo, context) => {
        console.log(
            `User / Agent ${agentInfo.id} requested product recommendations for "${productQuery}" with budget ${priceBudget}`
        );

        const beerFromApiJson = await beerData(productQuery);

        try {
            const parsedRecommendations = await responseBasedOnApiData(
                beerFromApiJson,
                productQuery,
                priceBudget
            );

            console.log("recommendations", parsedRecommendations);

            return {
                text: `Found ${parsedRecommendations.length} product recommendations for "${productQuery}" within your budget`,
                data: {
                    recommendations: parsedRecommendations,
                },
                ui: CardGrid(parsedRecommendations),
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
    tools: [getProductRecommendationsConfig, checkoutProductConfig],
});

export default productDainService;
