import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "";
const client = new MongoClient(uri);

export async function Exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}


export async function Connect() {
    try {
        await client.connect();
        console.log('Connected to database');
        process.on('SIGINT', Exit);
    } catch (error) {
        console.error(error);
    }
}