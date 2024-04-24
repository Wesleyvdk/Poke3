import express from "express";
import {Connect} from "./database";
import captureRouter from "./routers/capture";
import compareRouter from "./routers/compare";
import pokedexRouter from "./routers/pokedex";
import loginRouter from "./routers/login";
import registerRouter from "./routers/register";
import battleRouter from "./routers/battle";
import quizRouter from "./routers/quiz";
import starterRouter from "./routers/starter";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    return res.render("index");
});
app.get("/landing", async (req, res) => {
    return res.render("landing")
});
app.get("/capture", captureRouter);
app.get("/compare", compareRouter);
app.get("/pokedex", pokedexRouter);
app.get("/login", loginRouter);
app.get("/register", registerRouter);
app.get("/battle", battleRouter);
app.get("/quiz", quizRouter);
app.get("/starter", starterRouter);

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);

app.listen(app.get("port"), async () => {
    Connect();
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    // Gebruik het juiste type voor data
    let data: any = await response.json();
    console.log("The application is listening on http://localhost:" + app.get("port"));
})