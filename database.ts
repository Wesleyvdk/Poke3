import { Collection, MongoClient } from "mongodb";
import { Pokemon, User } from "./types";
import { randomPokemon } from "./app";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import session from "./session";
import exp from "constants";
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
      if (response) {
        let data: Pokemon = {
          name: response.name,
          attack: response.stats[1].base_stat,
          defense: response.stats[2].base_stat,
        };
        console.log(data);
        pokemons.push(data);
      } else {
        console.log('Retrying to fetch a valid Pokémon...');
        i--;
      }
    }
    let users: User[] = [
      {
        email: "pri@test.com",
        password: await bcrypt.hash("123", saltRounds),
        currentPokemon: pokemons[0],
        pokemons: pokemons,
      },
      {
        email: "test@test.com",
        password: await bcrypt.hash("test", saltRounds),
        currentPokemon: undefined,
        pokemons: [] as Pokemon[],
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
      pokemons: [] as Pokemon[],
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

export async function releasePokemon(email: string, pokemon: string) {
  
  let result = await userCollection
    .updateOne(
      { email: email},
      // @ts-ignore
      { $pull: { pokemons: { name: pokemon } } }
    )
    .then((result) => {
      console.log(result);
    });
}
export async function getCurrentPokemon(user: string) {
  let pokemon = await userCollection.findOne({ email: user });
  return pokemon?.currentPokemon;
}

export async function levelUp(pokemon: Pokemon) {
  const query = { "pokemons.name": pokemon.name };

  // Projection to return only the Pokémon details that match the name
  const projection = {
    projection: {
      pokemons: {
        $elemMatch: { name: pokemon.name },
      },
    },
  };

  // Find the document
  let pokemons = await userCollection.findOne(query, projection);
  console.log(pokemons);
  // Update operation to increment the Pokémon's attack and defense values by 1
  const update = {
    $inc: {
      "pokemons.$[elem].attack": 1,
      "pokemons.$[elem].defense": 1,
    },
  };

  // Array filter to match the correct Pokémon in the array
  const arrayFilters = [{ "elem.name": pokemon.name }];

  // Update the document
  const result = await userCollection.updateOne(query, update, {
    arrayFilters,
  });
  console.log(result);
}

export async function capturedPokemon(user: User, pokemon: any) {
  const query = { "pokemons.name": pokemon};

  // Projection to return only the Pokémon details that match the name
  const projection = {
    projection: {
      pokemons: {
        $elemMatch: { name: pokemon },
      },
    },
  };

  // Find the document
  let alreadyCaught = await userCollection.findOne(query, projection);

  if(!alreadyCaught){
    return false;
  }
  else{
    return true;
  }
}
export async function insertPokemon(user: User, pokemon: any) {
  let result = await userCollection.updateOne(
    { email: user.email },
    { $push: { pokemons: pokemon } },
    { upsert: true }
  );
  if (!result.acknowledged) {
    throw new Error("Insertion failed");
  }
  return result.upsertedId;
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
