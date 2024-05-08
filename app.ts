import express from "express";
import {Connect} from "./database";
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
    Connect();
    let response = await fetch("https://pokeapi.co/api/v2/pokemon");
    // Gebruik het juiste type voor data
    let data: any = await response.json();
    console.log("The application is listening on http://localhost:" + app.get("port"));
})