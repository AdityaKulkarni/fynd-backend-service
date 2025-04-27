import { CardUIBuilder, ImageCardUIBuilder, LayoutUIBuilder } from "@dainprotocol/utils";
import ProductModel from "./models/ProductModel";

const CardGrid = (parsedRecommendations: ProductModel[]) => {
    const mainColumn = new LayoutUIBuilder()
        .setRenderMode("page")
        .setLayoutType("column")
        .setAlignItems("center");

    const gridUI = new LayoutUIBuilder()
        .setRenderMode("page")
        .setLayoutType("grid") // Optional: row | column | grid
        .setGap(8) // Optional: spacing between items
        .setJustifyContent("between") // Optional: alignment on main axis
        .setAlignItems("center"); // Optional: alignment on cross axis

    parsedRecommendations.forEach((product: ProductModel) => {
        gridUI.addChild(
            new ImageCardUIBuilder(
                product.images && product.images.length > 0
                    ? product.images[0]
                    : "https://as2.ftcdn.net/v2/jpg/03/98/78/43/1000_F_398784300_Zf85OVP4Ok3Gif6UMm1hhDCjg9sEBySa.jpg"
            )
                .title(product.name)
                .description(`$${product.price}`)
                .imageAlt(product.name)
                .aspectRatio("square")
                .withOverlay(true)
                .onLearnMore({
                    tool: "checkoutProduct",
                    params: {
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image:
                            product.images && product.images.length > 0
                                ? product.images[0]
                                : undefined,
                    },
                })
                .build()
        );
    });

    mainColumn.addChild(gridUI.build()).addChild(
        new CardUIBuilder()
            .title("Proceed to checkout")
            .addField({ label: "Order ID", value: "12345" })
            .addField({ label: "Price", value: "$50" })
            .onConfirm({
                tool: "checkoutProduct",
                params: {
                    productId: "123",
                    name: "Product 1",
                    price: 50,
                    image: "https://as2.ftcdn.net/v2/jpg/03/98/78/43/1000_F_398784300_Zf85OVP4Ok3Gif6UMm1hhDCjg9sEBySa.jpg",
                },
                paramSchema: {
                    productId: {
                        type: "string",
                        default: "123",
                    },
                    name: {
                        type: "string",
                        default: "Product 1",
                    },
                    price: {
                        type: "number",
                        default: 50,
                    },
                    image: {
                        type: "string",
                        default:
                            "https://as2.ftcdn.net/v2/jpg/03/98/78/43/1000_F_398784300_Zf85OVP4Ok3Gif6UMm1hhDCjg9sEBySa.jpg",
                    },
                },
            })
    );
    return mainColumn.build();
};

export default CardGrid;
