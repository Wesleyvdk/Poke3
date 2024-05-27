import { Collection, MongoClient } from "mongodb";
import { APIPokemon, Pokemon, User } from "./types";
import { randomPokemon } from "./app";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI ?? "";
const client = new MongoClient(uri);

const pokemonCollection: Collection = client.db("pokemon").collection("pokemon");
const userCollection: Collection = client.db("pokemon").collection("users");

export async function exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function seed(){
    let users: User[] = [{
        id: "1",
        email: "pri@test.com",
        password: "123"
    },{
        id: "2",
        email: "test@test.com",
        password: "test"
    }];
if(await userCollection.countDocuments() === 0){
    await userCollection.insertMany(users);
}
if (await pokemonCollection.countDocuments() === 0) {
    let pokemon: Pokemon[] = [];
    for(let i = 0; i < 10; i++){
        let response = await randomPokemon();
        let data: Pokemon =  {userid: "1", name: response.name, attack: response.stats[1].base_stat, defense: response.stats[2].base_stat};
        pokemon.push(data);
    }
    await pokemonCollection.insertMany(pokemon);
}}

export async function authenticate(email: string, password: string){
    let user = await userCollection.findOne({email: email, password: password});
    if(user){
        return user;
    }
}

export async function register(email: string, password: string){
    if(await userCollection.findOne({email: email})){
        return "User already exists"
    }else{
        let user = await userCollection.insertOne({email: email, password: password});
        return user;
    }
}

export const getAllPokemons = async () => {
    let pokemonData: APIPokemon[] = [];
    let response = await (await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1400")).json();
    let promises =  response.results.map(async (element: { url: string | URL | Request; }, index: number) => {
      let pokemonDetails: APIPokemon = await (await fetch(element.url)).json();
      pokemonDetails.id = index + 1;
      return pokemonDetails;
    });
    pokemonData = await Promise.all(promises);
    pokemonData.sort((a, b) => a.id - b.id);
    return pokemonData;
};

export async function getPokemons(user: string){
    let pokemons = await pokemonCollection.find({userid: user}).toArray();
    return pokemons;
}
export async function levelUp(){
    let pokemons = await pokemonCollection.findOne({name: "unown"});
    await pokemonCollection.updateOne({name: "unown"}, {$set: {attack: pokemons?.attack + 1, defense: pokemons?.defense + 1}});
}

export async function connect() {
    try {
        await client.connect();
        console.log('Connected to database');
        process.on('SIGINT', exit);
    } catch (error) {
        console.error(error);
    }
}


