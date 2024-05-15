
export const getAllPokemons = async () => {
    let pokemonData: any = [];
    let response = await (await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1400")).json();
    response.results.forEach(async (element: { url: string | URL | Request; }) => {
      let pokemonDetails = await (await fetch(element.url)).json();
      pokemonData.push(pokemonDetails);
    });
    return pokemonData;
};