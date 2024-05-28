import express from "express";
import { pokemons } from "../app";
import { APIPokemon, Pokemon, Type } from "../types";

export default function pokemonGameRoutes(){
  const router = express.Router();

  router.get("", (req, res) => {
    res.render("landing");
  });

  router.get("/capture", (req, res) => {
    res.render("capture");
  });

  router.get("/compare", (req, res) => {
    res.render("compare");
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

  router.get("/quiz", (req, res) => {
    res.render("quiz");
  });

  router.get("/battle", (req, res) => {
    res.render("battle");
  });

  router.get("/starter", (req, res) => {
    res.render("starter");
  });

  return router;
}