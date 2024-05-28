import express from "express";
import { connect, getPokemons, seed } from "./database";
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
  let response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1400"
  );
  /*  console.log(await response.json()); */
  console.log(
    "The application is listening on http://localhost:" + app.get("port")
  );
});

export async function randomPokemon() {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon");
  let data: any = await response.json();
  let count = data.count;
  let random = Math.floor(Math.random() * count) + 1;
  console.log(random);
  try {
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
  } catch (e) {
    randomPokemon();
  }

  return await response.json().catch((e: any) => {
    console.log(e.message);
    console.log(response);
    randomPokemon();
  });
}
