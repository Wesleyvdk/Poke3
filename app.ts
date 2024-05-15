import express from "express";
import {connect, getPokemons, seed} from "./database";
import { Pokemon } from "./types";
import indexRouter from "./routes/index.routes";
import pokemonGameRoutes from "./routes/pokemonGame.routes";
import { getAllPokemons } from "./services/pokemonService";

export let pokemons: any = [];
const app = express();


app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter());
app.use("/pokemon", pokemons, pokemonGameRoutes());

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);



app.listen(app.get("port"), async () => {
    connect();
    pokemons = await getAllPokemons();
    console.log("The application is listening on http://localhost:" + app.get("port"));
})

export async function randomPokemon(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    let data: any = await response.json();
    let count = data.count;
    let random = Math.floor(Math.random() * count) + 1;
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    return response.json();
}