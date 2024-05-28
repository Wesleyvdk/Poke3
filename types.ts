import { ObjectId } from "mongodb";

export interface Pokemon {
  _id?: ObjectId;
  name: string;
  attack: number;
  defense: number;
}

export interface User {
    _id?: ObjectId;
  email?: string;
  password?: string;
  currentPokemon?: Pokemon;
  pokemons?: Pokemon[];
}

export interface FlashMessage {
  type: "error" | "success" | "info";
  message: string;
}


// API Pokemon Types

export interface APIPokemon {
    id: number;
    name: string;
    order: number;
    sprites: Sprites;
    stats: Stats[];
    types: Type[];
    weight: number;
  
  }
export interface Type {
    slot: number;
    type: Stat;
  }
export interface Stats {
    base_stat: number;
    effort: number;
    stat: Stat;
  }
  interface Stat {
    name: string;
    url: string;
  }
  interface Sprites {
    other: Other;
  }
  interface Other {
    'official-artwork': Officialartwork;
  }
  interface Officialartwork {
    front_default: string;
    front_shiny: string;
  }
