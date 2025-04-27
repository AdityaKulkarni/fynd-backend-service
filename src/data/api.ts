// export const beerData = async () => {
//     const beerFromApi = await fetch("https://fynd-ecom-app.vercel.app/api/products");
//     const beerFromApiJson = await beerFromApi.json();
//     return beerFromApiJson;
// }

export const beerData = async (query: string) => {
    try{

        const beerFromApi = await fetch("https://612d-164-67-70-232.ngrok-free.app/query", {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: { 
                'Content-Type': 'application/json'
            },
        });
        const beerFromApiJson = await beerFromApi.json();
        return beerFromApiJson.data;
    }catch(error){
        console.log("error", error);
        return [];
    }   
}