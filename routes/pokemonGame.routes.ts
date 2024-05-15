import express from "express";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { randomPokemon } from "../app";

export default function pokemonGameRoutes() {
  const router = express.Router();

  router.get("/", (req, res) => {
    let user = req.session.user!;
    if (!user) {
      res.redirect("/login");
      return;
    }
    res.render("landing");
  });

  router.get("/capture", (req, res) => {
    res.render("capture");
  });

  router.get("/compare", (req, res) => {
    res.render("compare");
  });

  router.get("/pokedex", (req, res) => {
    res.render("pokedex");
  });

  router.get("/quiz", (req, res) => {
    randomPokemon().then((data) => {
      req.session.answer = data.name;
      res.render("quiz", {
        image: data.sprites.other["official-artwork"]["front_default"],
        answer: data.name,
        pokemon: "pikachu",
      });
      console.log(data.name);
    });
  });
  router.post("/quiz", (req, res) => {
    const guess: string = req.body.guess;
    const answer: string = req.session.answer!;
    if (guess === answer) {
      req.session.message = { type: "success", message: "Correct!" };
    }
  });

  router.get("/battle", (req, res) => {
    res.render("battle");
  });

  router.get("/starter", (req, res) => {
    res.render("starter");
  });

  return router;
}
