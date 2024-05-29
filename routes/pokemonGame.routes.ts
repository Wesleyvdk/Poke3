import express from "express";
import { pokemons } from "../app";
import { APIPokemon, Pokemon, Type } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import {
  capturedPokemon,
  getEvolutionChain,
  getCurrentPokemon,
  insertPokemon,
  levelUp,
  releasePokemon,
} from "../database";

import e from "express";
export async function randomPokemon() {
  try {
    // Fetch the total count of Pokémon
    let count = pokemons.length;

    // Generate a random Pokémon ID
    let random = Math.floor(Math.random() * count) + 1;
    let data = await pokemons.find(
      (pokemon: { id: number }) => pokemon.id === random
    );
    return data;
  } catch (error) {
    console.error(error);
    return randomPokemon();
  }
}

export default function pokemonGameRoutes() {
  const router = express.Router();
  router.get("/", async (req, res) => {
    let user = req.session.user!;
    let currentPokemon = await pokemons[0];
    if (!user) {
      res.redirect("/login");
      return;
    }
    if (!user.currentPokemon) {
      res.redirect("pokemon/starter");
    }
    res.render("landing", {currentPokemon});
  });

  router.get("/capture", async (req, res) => {
    let random = await randomPokemon();
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    console.log(random);
    // let rand = await random.json();
    let current = await currentPokemon.json();
    req.session.alreadyCaught = await capturedPokemon(
      req.session.user!,
      random.name
    );

    req.session.randomPokemon = {
      name: random.name,
      attack: random.stats[1].base_stat,
      defense: random.stats[2].base_stat,
    };
    if (!req.session.attempts) {
      req.session.attempts = 3;
    }
    const attempts = req.session.attempts;
    if (req.session.alreadyCaught) {
      res.render("capture", {
        randomPokemon: random,
        alreadyCaptured: true,
        attempts: attempts,
        currentPokemon:
          current.sprites.other["official-artwork"]["front_default"],
        caught: "",
        message: "alreadyCaught",
      });
    } else {
      res.render("capture", {
        randomPokemon: random,
        alreadyCaptured: false,
        attempts: attempts,
        currentPokemon:
          current.sprites.other["official-artwork"]["front_default"],
        caught: "",
        message: "",
      });
    }
  });

  router.post("/capture", async (req, res) => {
    if (
      res.locals.message?.message !== "caught" &&
      !req.session.alreadyCaught
    ) {
      //capture rate
      let randomResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${req.session.randomPokemon.name}`
      );
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${
          req.session.user!.currentPokemon?.name
        }`
      );
      let currentPokemon = await response.json();
      let randomPokemon = await randomResponse.json();
      let catchRate =
        100 -
        randomPokemon.stats[2].base_stat +
        currentPokemon.stats[1].base_stat;

      // Generate a random number between 1 and 100
      let randomNumber = Math.floor(Math.random() * 100) + 1;
      console.log(`catchrate: ${catchRate}, random: ${randomNumber}`);

      if (randomNumber <= catchRate) {
        // Pokemon is caught
        req.session.message = { type: "success", message: "caught" };
        res.render("capture", {
          randomPokemon: randomPokemon,
          alreadyCaptured: false,
          attempts: req.session.attempts,
          currentPokemon:
            currentPokemon.sprites.other["official-artwork"]["front_default"],
          caught: "",
          message: req.session.message.message,
        });
      } else if (req.session.attempts! > 0) {
        // Pokemon escapes
        req.session.attempts! -= 1;
        req.session.message = { type: "error", message: "escaped" };
        res.render("capture", {
          randomPokemon: randomPokemon,
          alreadyCaptured: false,
          attempts: req.session.attempts,
          currentPokemon:
            currentPokemon.sprites.other["official-artwork"]["front_default"],
          caught: "",
          message: req.session.message.message,
        });
      } else {
        req.session.message = { type: "error", message: "out_of_attempts" };
        res.render("capture", {
          randomPokemon: randomPokemon,
          alreadyCaptured: false,
          attempts: req.session.attempts,
          currentPokemon:
            currentPokemon.sprites.other["official-artwork"]["front_default"],
          caught: "",
          message: req.session.message.message,
        });
      }
    } else if (res.locals.message?.message === "caught") {
      let name = req.body.name;
      if (req.body.name === "" || req.body.name === null) {
        name = req.session.randomPokemon.name;
      }
      let pokemon: Pokemon = {
        name: name,
        nickname: name,
        attack: req.session.randomPokemon.attack,
        defense: req.session.randomPokemon.defense,
      };
      insertPokemon(req.session.user!, pokemon);
      res.redirect("/pokemon/capture");
    } else {
      let randomRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${req.session.randomPokemon.name}`
      );
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${
          req.session.user!.currentPokemon?.name
        }`
      );
      let randomPokemon = await randomRes.json();
      let currentPokemon = await response.json();
      req.session.message = { type: "error", message: "release" };
      console.log(req.session.message);
      res.render("capture", {
        randomPokemon: randomPokemon,
        alreadyCaptured: true,
        attempts: req.session.attempts,
        currentPokemon:
          currentPokemon.sprites.other["official-artwork"]["front_default"],
        caught: "",
        message: req.session.message.message,
      });
    }
  });

  router.post("/release", async (req, res) => {
    const action = req.body.action;
    if (action === "yesRelease") {
      let randomPokemon = req.session.randomPokemon.name;
      await releasePokemon(req.session.user!.email!, randomPokemon);
      req.session.message = { type: "success", message: "released" };
      res.redirect("/pokemon/capture");
    } else if (action === "noRelease") {
      req.session.message = { type: "error", message: "not-released" };
      res.redirect("/pokemon/capture");
    } else {
      res.send("Unknown action");
    }
  });

  router.get("/compare", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    let random: APIPokemon = await randomPokemon();
    let current: any = await currentPokemon.json();
    let sortedPokemons: APIPokemon[] = pokemons;
    res.render("compare", {
      pokemons: sortedPokemons,
      firstPokemon: current,
      secondPokemon: random,
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.post("/compare", async (req, res) => {
    let sortedPokemons: APIPokemon[] = pokemons;
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    let current: any = await currentPokemon.json();
    let pokemon1 = req.body.firstPokemon;
    let firstPokemon: APIPokemon = await pokemons.find(
      (pokemon: { name: string }) => pokemon.name === pokemon1
    );
    let pokemon2 = req.body.secondPokemon;
    let secondPokemon: APIPokemon = await pokemons.find(
      (pokemon: { name: string }) => pokemon.name === pokemon2
    );
    res.render("compare", {
      pokemons: sortedPokemons,
      firstPokemon: firstPokemon,
      secondPokemon: secondPokemon,
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/pokedex", async (req, res) => {
    const currentPokemonRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    console.log(currentPokemonRes);
    const search = req.query.search ?? "";
    const type = req.query.type ?? "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    let SortedPokemons: APIPokemon[] = pokemons;
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon) => {
        return searchRegex.test(pokemon.name);
      });
    }
    if (type) {
      SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon) => {
        return pokemon.types.some((pokemonType: Type) => {
          return pokemonType.type.name === type;
        });
      });
    }
    const currentPokemon = await currentPokemonRes.json();
    const totalItems = SortedPokemons.length;
    const items = SortedPokemons.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit);
    res.render("pokedex", {pokemons: items, search, type, totalPages: totalPages, currentPage: page, currentPokemon: currentPokemon});
  });


  router.get("/pokedex/:name", async (req, res) => {
    const name = req.params.name;
    const pokemon: APIPokemon = await pokemons.find((pokemon: APIPokemon) => pokemon.name === name);  
    if(pokemon){
      const currentPokemon = pokemons[0];
      const species = await (await fetch(pokemon.species.url)).json();
      const evolutionPokemons: APIPokemon[] = await getEvolutionChain(species.evolution_chain.url);
      res.render("pokemon", {pokemon, currentPokemon, evolutionPokemons});
    } else {
      res.status(404).send('Pokemon not found');
      return;
    }
  });

  router.get("/quiz", async (req, res) => {
    randomPokemon().then(async (data) => {
      let currentPokemon = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${
          req.session.user!.currentPokemon?.name
        }`
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
      let pokemon = req.session.user!.currentPokemon!;
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

  router.get("/battlefinder", async (req, res) => {
    const currentPokemonRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    console.log(currentPokemonRes);
    const search = req.query.search ?? "";
    const type = req.query.type ?? "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    let SortedPokemons: APIPokemon[] = pokemons;
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon) => {
        return searchRegex.test(pokemon.name);
      });
    }
    if (type) {
      SortedPokemons = SortedPokemons.filter((pokemon: APIPokemon) => {
        return pokemon.types.some((pokemonType: Type) => {
          return pokemonType.type.name === type;
        });
      });
    }
    const currentPokemon = await currentPokemonRes.json();
    const totalItems = SortedPokemons.length;
    const items = SortedPokemons.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit);
    res.render("battlefinder", {
      pokemons: items,
      search,
      type,
      totalPages: totalPages,
      currentPage: page,
      currentPokemon:
        currentPokemon.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.get("/battle", async (req, res) => {
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    let current: APIPokemon = await currentPokemon.json();
    console.log(`opponent: ` + req.query.opponent);
    let opponent: APIPokemon = await pokemons.find(
      (pokemon: { name: string }) => pokemon.name === req.query.opponent
    );
    console.log(`opponent: ` + req.query.opponent);
    req.session.yourHP = current.stats[0].base_stat;
    req.session.opponentHP = opponent.stats[0].base_stat;
    req.session.opponent = opponent;
    res.render("battle", {
      yourPokemon: current,
      yourHP: req.session.yourHP,
      yourMaxHP: current.stats[0].base_stat,
      opponentPokemon: opponent,
      opponentHP: req.session.opponentHP,
      opponentMaxHP: opponent.stats[0].base_stat,
      currentPokemon:
        current.sprites.other["official-artwork"]["front_default"],
    });
  });

  router.post("/battle", async (req, res) => {
    //implement attack and defense calculation
    let currentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${
        req.session.user!.currentPokemon?.name
      }`
    );
    let current: APIPokemon = await currentPokemon.json();
    console.log(
      (await req.session.opponentHP!) -
        (req.session.opponent!.stats[2].base_stat - current.stats[1].base_stat)
    );
    req.session.opponentHP =
      (await req.session.opponentHP!) -
      (req.session.opponent!.stats[2].base_stat - current.stats[1].base_stat);
    if (req.session.opponentHP! <= 0) {
      req.session.message = { type: "success", message: "won" };
      insertPokemon(req.session.user!, req.session.opponent!);
      res.redirect("/pokemon/battlefinder");
    } else {
      req.session.yourHP =
        (await req.session.yourHP!) -
        (current.stats[2].base_stat - req.session.opponent!.stats[1].base_stat);
      console.log(
        (await req.session.yourHP!) -
          (current.stats[2].base_stat -
            req.session.opponent!.stats[1].base_stat)
      );
      if (req.session.yourHP! <= 0) {
        req.session.message = { type: "error", message: "lost" };
        res.redirect("/pokemon/battlefinder");
      } else {
        if (req.session.yourHP! > current.stats[0].base_stat) {
          req.session.yourHP = current.stats[0].base_stat;
        }
        if (
          req.session.opponentHP! > req.session.opponent!.stats[0].base_stat
        ) {
          req.session.opponentHP = req.session.opponent!.stats[0].base_stat;
        }
        res.render("battle", {
          yourPokemon: current,
          yourHP: req.session.yourHP,
          yourMaxHP: current.stats[0].base_stat,
          opponentPokemon: req.session.opponent,
          opponentHP: req.session.opponentHP,
          opponentMaxHP: req.session.opponent!.stats[0].base_stat,
          currentPokemon:
            current.sprites.other["official-artwork"]["front_default"],
        });
      }
    }
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
      nickname: data.name,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
    };
    insertPokemon(req.session.user!, pokemon);
    req.session.user!.currentPokemon = pokemon;
    res.redirect("/pokemon");
  });

  return router;
}
