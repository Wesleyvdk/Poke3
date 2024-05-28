import express from "express";
import { pokemons } from "../app";
import { APIPokemon, Pokemon, Type } from "../types";
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

  router.get("/pokedex", (req, res) => {
    const search = req.query.search ?? '';
    const type = req.query.type ?? '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    let SortedPokemons: APIPokemon[] = pokemons;
    if(search){
      const searchRegex = new RegExp(search as string, 'i');
       SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon)=> {
        return searchRegex.test(pokemon.name);
      });
    }
    if(type){
      SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon)=> {
        return pokemon.types.some((pokemonType: Type) => {
          return pokemonType.type.name === type
        })
      });
    }
    const totalItems = SortedPokemons.length;
    const items = SortedPokemons.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit);
    res.render("pokedex", {pokemons: items, search, type, totalPages: totalPages, currentPage: page});
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
