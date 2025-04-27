import productDainService from "./services/ProductDainService";

const port = Number(process.env.PORT) || 2022;

productDainService.startNode({ port: port }).then(({ address }) => {
  console.log("Product DAIN Service is running at :" + address().port);
});
