import express from "express";
import {Connect} from "./database";

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
    Connect();
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    // Gebruik het juiste type voor data
    let data: any = await response.json();
    console.log(`The application is listening on http://localhost:3000`);
})