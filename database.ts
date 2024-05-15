import { Collection, MongoClient } from "mongodb";
import { Pokemon, User } from "./types";
import { randomPokemon } from "./app";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import session from "./session";
dotenv.config();

const uri = process.env.MONGO_URI ?? "";
const client = new MongoClient(uri);

const userCollection: Collection = client.db("poke3").collection("users");

const saltRounds: number = 10;

export async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

export async function seed() {
  if ((await userCollection.countDocuments()) === 0) {
    let pokemons: Pokemon[] = [];
    for (let i = 0; i < 5; i++) {
      let response = await randomPokemon();
      let data: Pokemon = {
        name: response.name,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
      };
      pokemons.push(data);
    }
    let users: User[] = [
      {
        email: "pri@test.com",
        password: await bcrypt.hash("123", saltRounds),
        pokemons: pokemons,
      },
      {
        email: "test@test.com",
        password: await bcrypt.hash("test", saltRounds),
      },
    ];
    await userCollection.insertMany(users);
  }
}

export async function authenticate(email: string, password: string) {
  if (email === "" || password === "") {
    throw new Error("Email and password required");
  }
  let user: User | null = await userCollection.findOne<User>({ email: email });
  if (user) {
    if (await bcrypt.compare(password, user.password!)) {
      console.log(user);
      return user;
    } else {
      throw new Error("Invalid password");
    }
  } else {
    throw new Error("User not found");
  }
}

export async function register(email: string, password: string) {
  let userExists: User | null = await userCollection.findOne({ email: email });
  if (userExists) {
    return userExists;
  } else {
    let result = await userCollection.insertOne({
      email: email,
      password: await bcrypt.hash(password, saltRounds),
    });
    if (!result.acknowledged) {
      throw new Error("Insertion failed");
    }

    const insertedUser = await userCollection.findOne({
      _id: result.insertedId,
    });
    if (!insertedUser) {
      throw new Error("Failed to retrieve inserted user");
    }

    return insertedUser as User;
  }
}

export async function getPokemons(user: string) {
  let pokemons = await userCollection.find({ email: user }).toArray();
  return pokemons;
}
export async function levelUp() {
  let pokemons = await userCollection.findOne({ name: "unown" });
  await userCollection.updateOne(
    { name: "unown" },
    { $set: { attack: pokemons?.attack + 1, defense: pokemons?.defense + 1 } }
  );
}

export async function connect() {
  try {
    await client.connect();
    console.log("Connected to database");
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
  }
}
