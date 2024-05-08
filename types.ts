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
    currentPokemon?: string;
    pokemons?: Pokemon[];
}

export interface FlashMessage {
    type: "error" | "success" | "info"
    message: string;
}
