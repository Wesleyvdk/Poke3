import express from "express";
import { connect, getAllPokemons, seed } from "./database";
import indexRouter from "./routes/index.routes";
import pokemonGameRoutes from "./routes/pokemonGame.routes";
import session from "./session";
import { flashMiddleware } from "./middleware/flashMiddleware";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { APIPokemon } from "./types";

export let pokemons: any;
const app = express();


app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session);
app.use(flashMiddleware);
app.use("/", indexRouter());
app.use("/pokemon" , secureMiddleware, pokemonGameRoutes());

app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.send("404 - Not Found");
});



app.listen(app.get("port"), async () => {
  await connect();
  seed();
  pokemons = await getAllPokemons();
  console.log(
    "The application is listening on http://localhost:" + app.get("port")
  );
});

export async function randomPokemon() {
  try {
    // // Fetch the total count of Pokémon
    // let count = pokemons.length;
    // // Generate a random Pokémon ID
    // let random = Math.floor(Math.random() * count) + 1;
    // let data = await pokemons.find(
    //   (pokemon: { id: number }) => pokemon.id === random
    // );
    const data: APIPokemon = pokemons[0];
    return data;
  } catch (error) {
    console.error(error);
    return randomPokemon();
  }
}
