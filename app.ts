import express from "express";
import {connect, getPokemons, seed} from "./database";
import { Pokemon } from "./types";
import loginRoutes from "./routes/login.routes";
import registerRoutes from "./routes/register.routes";
import indexRouter from "./routes/index.routes";
import pokemonGameRoutes from "./routes/pokemonGame.routes";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter());
app.use("/pokemon", pokemonGameRoutes());

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);

app.listen(app.get("port"), async () => {
    connect();
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    console.log(response);
    let data: any = await response.json();
    let count = data.count;
    let random = Math.floor(Math.random() * count) + 1;
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    return response.json();
    console.log("The application is listening on http://localhost:" + app.get("port"));
})
