import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect()
    db = mongoClient.db("myWallet") 
    console.log("Mongo conected")
} catch (e) {
    console.log("Not conected to mongo error:", e)
}

export default db;