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
    res.render("pokedex", {pokemons: SortedPokemons, search, type});
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