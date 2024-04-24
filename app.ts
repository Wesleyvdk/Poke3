import express from "express";
import {connect, getPokemons, seed} from "./database";
import { Pokemon } from "./types";

const app = express();

app.set("view engine", "ejs");

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    
    return res.render("index");
});

app.get("/capture", async (req, res) => {
    return res.render("capture");
})
app.get("/compare", async (req, res) => {
    return res.render("compare");
})

app.get("/pokedex", async (req, res) => {
    return res.render("pokedex")
})

app.get("/landing", async (req, res) => {
    return res.render("landing")
})

app.get("/login", async (req, res) => {
    return res.render("login")
});

app.get("/register", async (req, res) => {
    return res.render("register")
})

app.get("/battle", async (req, res) => {
    return res.render("pokemonBattle")
})

app.get("/quiz", async (req, res) => {
    return res.render("quiz")
})

app.get("/starter", async (req, res) => {
    return res.render("starter")
})

app.listen(3000, async () => {
    connect();
    seed();
    console.log(`The application is listening on http://localhost:3000`);
})

export async function randomPokemon(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    console.log(response);
    let data: any = await response.json();
    let count = data.count;
    let random = Math.floor(Math.random() * count) + 1;
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    return response.json();
}