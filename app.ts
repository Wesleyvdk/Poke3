import express from "express";
import { connect, getCurrentPokemon, seed } from "./database";
import { Pokemon } from "./types";

import indexRouter from "./routes/index.routes";
import pokemonGameRoutes from "./routes/pokemonGame.routes";
import session from "./session";
import { flashMiddleware } from "./middleware/flashMiddleware";
import { secureMiddleware } from "./middleware/secureMiddleware";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session);
app.use(flashMiddleware);
app.use("/", indexRouter());
app.use("/pokemon", secureMiddleware, pokemonGameRoutes());

app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.send("404 - Not Found");
});

app.listen(app.get("port"), async () => {
  await connect();
  seed();
  // let response = await fetch(
  //   "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1400"
  // );
  /*  console.log(await response.json()); */
  console.log(
    "The application is listening on http://localhost:" + app.get("port")
  );
});

export async function randomPokemon() {
  try {
    // Fetch the total count of Pokémon
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    if (!response.ok) throw new Error('Failed to fetch Pokémon count');
    
    let data: any = await response.json();
    let count = data.count;
    
    // Generate a random Pokémon ID
    let random = Math.floor(Math.random() * count) + 1;
    console.log(`Fetching Pokémon with ID: ${random}`);
    
    // Fetch the Pokémon data by ID
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    
    // Check if the response is OK, if not throw an error
    if (!response.ok){
      randomPokemon();
      throw new Error(`Failed to fetch Pokémon with ID: ${random}`);
    }   
    
    data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return randomPokemon();
  }
}
