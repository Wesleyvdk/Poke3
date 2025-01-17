import session from "express-session";
import { APIPokemon, FlashMessage, User } from "./types";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI ?? "",
  collection: "sessions",
  databaseName: "poke3",
});

declare module "express-session" {
  export interface SessionData {
    user?: User;
    message?: FlashMessage;
    answer?: string;
    randomPokemon?: any;
    attempts?: number;
    alreadyCaught?: boolean;
    opponent?: APIPokemon;
    yourHP?: number;
    opponentHP?: number;
  }
}

export default session({
  secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
  store: mongoStore,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});
