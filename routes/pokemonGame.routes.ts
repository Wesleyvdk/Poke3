import express from "express";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { randomPokemon } from "../app";
import { Pokemon } from "../types";
import { getCurrentPokemon, insertPokemon, levelUp } from "../database";

export default function pokemonGameRoutes() {
  const router = express.Router();
  router.get("/", async (req, res) => {
    let user = req.session.user!;
    let currentPokemon = getCurrentPokemon(user.email!);
    if (!user) {
      res.redirect("/login");
      return;
    }
    if (!user.currentPokemon) {
      res.redirect("pokemon/starter");
    }
    res.render("landing");
  });

  router.get("/capture", async (req, res) => {
    let random = await randomPokemon();
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.session.user!.currentPokemon}`
    );
    let current: any = await currentPokemon.json();
    res.render("capture", {
      randomPokemonName: random.name,
      randomPokemonImage: random.sprites.other["official-artwork"]["front_default"],
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
      console.log(req.session.answer);
      res.render("quiz", {
        image: data.sprites.other["official-artwork"]["front_default"],
        answer: data.name,
        pokemon: current.name,
        currentPokemon:
          current.sprites.other["official-artwork"]["front_default"],
        result: null,
      });
    });
  });
  router.post("/quiz", async (req, res) => {
    const guess: string = req.body.guess;
    const answer: string = req.session.answer!;
    if (guess === answer) {
      console.log("Correct!");
      let pokemon = req.session.user!.currentPokemon ?? "";
      levelUp(pokemon);
      req.session.message = { type: "success", message: "Correct!" };
      randomPokemon().then(async (data) => {
        let currentPokemon = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${
            req.session.user!.currentPokemon
          }`
        );
        let current: any = await currentPokemon.json();
        req.session.answer = data.name;
        res.render("quiz", {
          image: data.sprites.other["official-artwork"]["front_default"],
          answer: data.name,
          pokemon: current.name,
          currentPokemon:
            current.sprites.other["official-artwork"]["front_default"],
          result: "correct",
        });
      });
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
    console.log(req.session.user!.currentPokemon);
    res.render("starter");
  });
  router.post("/starter", async (req, res) => {
    console.log(req.body.starter);
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.body.starter}`
    );
    let data = await response.json();
    let pokemon: Pokemon = {
      name: data.name,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
    };
    insertPokemon(req.session.user!, pokemon);
    req.session.user!.currentPokemon = pokemon.name;
    res.redirect("/pokemon");
  });

  return router;
}
