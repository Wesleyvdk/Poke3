import { ObjectId } from "mongodb";

export interface Pokemon {
    _id?: ObjectId;
    userid: string;
    name: string;
    attack: number;
    defense: number;
}

export interface User {
    _id?: ObjectId;
    id: string;
    email: string;
    password: string;
    currentPokemon?: string;
}