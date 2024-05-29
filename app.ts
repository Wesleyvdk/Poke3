import express from "express";
import { connect, getPokemons, getAllPokemons, seed } from "./database";
import { APIPokemon, Pokemon } from "./types";
import indexRouter from "./routes/index.routes";
import pokemonGameRoutes from "./routes/pokemonGame.routes";
import session from "./session";
import { flashMiddleware } from "./middleware/flashMiddleware";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { sessionMiddleware } from "./middleware/sessionMiddleware";

export let pokemons: any;
const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session);
app.use(flashMiddleware);
app.use(sessionMiddleware);
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
