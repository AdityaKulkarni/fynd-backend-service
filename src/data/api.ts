export const beerData = async () => {
    const beerFromApi = await fetch("https://fynd-ecom-app.vercel.app/api/products");
    const beerFromApiJson = await beerFromApi.json();
    return beerFromApiJson;
}