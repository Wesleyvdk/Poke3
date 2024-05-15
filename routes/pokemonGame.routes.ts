import express from "express";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { randomPokemon } from "../app";

export default function pokemonGameRoutes() {
  const router = express.Router();
  router.get("/", async (req, res) => {
    let user = req.session.user!;
    if (!user) {
      res.redirect("/login");
      return;
    }

    res.render("landing");
  });

  router.get("/capture", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
    );
    let current: any = await currentPokemon.json();
    res.render("capture", {
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/compare", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
    );
    let current: any = await currentPokemon.json();
    res.render("compare", {
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/pokedex", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
    );
    let current: any = await currentPokemon.json();
    res.render("pokedex", {
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/quiz", async (req, res) => {
    randomPokemon().then(async (data) => {
      let currentPokemon = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
      );
      let current: any = await currentPokemon.json();
      req.session.answer = data.name;
      res.render("quiz", {
        image: data.sprites.other["official-artwork"]["front_default"],
        answer: data.name,
        pokemon: "pikachu",
        currentPokemon:
          current.sprites.other["official-artwork"]["front_default"],
      });
      /* currentPokemon = await currentPokemon.json(); */
    });
  });
  router.post("/quiz", (req, res) => {
    const guess: string = req.body.guess;
    const answer: string = req.session.answer!;
    if (guess === answer) {
      req.session.message = { type: "success", message: "Correct!" };
    }
  });

  router.get("/battle", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
    );
    let current: any = await currentPokemon.json();
    res.render("battle", {
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/starter", (req, res) => {
    res.render("starter");
  });
  router.post("/starter", (req, res) => {});

  return router;
}
