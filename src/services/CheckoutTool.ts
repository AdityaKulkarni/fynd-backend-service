import { z } from "zod";

import { ToolConfig } from "@dainprotocol/service-sdk";
import { DainResponse, PaymentUIBuilder } from "@dainprotocol/utils";

const checkoutProductConfig: ToolConfig = {
    id: "checkoutProduct",
    name: "Checkout Product",
    description: "Initiate checkout and payment for a product",
    input: z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        image: z.string().optional(),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    handler: async ({ productId, name, price, image }, agentInfo, context) => {
        console.log("checkoutProduct", productId, name, price, image);
        // Build the payment UI
        const paymentUI = new PaymentUIBuilder(
            true,
            {
                amount: 50,
                currency: "USD",
                message: "Payment successful",
                paymentSuccess: true,
                transactionId: "1234567890",
            },
            "page"
        )
            .onPay({
                tool: "processPayment", // You can implement this tool for actual payment logic
                params: { productId, amount: price },
            })
            .build();

        return new DainResponse({
            text: `Checkout for ${name}`,
            data: { success: true, message: `Ready to pay for ${name}` },
            ui: paymentUI,
        });
    },
};

export default checkoutProductConfig;
