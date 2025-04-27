import { GoogleGenAI } from "@google/genai";
import ProductModel from "../models/ProductModel";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const instructions = `
You are an AI assistant for a product search tool. Follow these instructions precisely:
- You will help the user find products from the predefined JSON array below.
- The user will specify the product they want and their maximum budget.
- Filter the JSON array to return only products that:
    - Strictly match the user's query based on the product name, description, and price (price must be less than or equal to the user's budget).
- DO NOT modify the JSON array or its contents in any way.
- ONLY search and return products from the provided JSON array.
- Your response MUST be:
    - The filtered JSON array containing only the matching products, as plain text.
    - NO additional text, explanations, comments, or formatting (do not use code blocks or markdown).
    - Only a single response containing the result.
- DO NOT ask the user any follow-up questions.
- DO NOT include any introduction or closing statements.
- DO NOT start your response with \`\`\`json or \`\`\`

Here is the JSON array for product search:
`;

export const responseBasedOnApiData = async (
    data: ProductModel[],
    productQuery: string,
    priceBudget: number
) => {
  try{

  
    const chat = ai.chats.create({
        model: "gemini-1.5-pro",
        config: {
            systemInstruction: instructions.concat(JSON.stringify(data)),
        },
        history: [
            {
                role: "user",
                parts: [
                    {
                        text: `I want to find ${productQuery} within ${priceBudget}. Match based on name, description and attributes and reference the products from the provided instructions.`,
                    },
                ],
            },
        ],
    });

    const response = await chat.sendMessage({
        message: `Find products in the price range of ${priceBudget}`,
    });

    console.log("gemini response", JSON.stringify(response.candidates));

    let recommendations = JSON.parse(
        response.candidates[0].content.parts[0].text
            .replace("```json", "")
            .replace("```", "")
    );

    recommendations = [
        ...recommendations.map((product: ProductModel) => ({
            ...product,
            id: product["_id"],
        })),
    ];
    return recommendations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default ai;
