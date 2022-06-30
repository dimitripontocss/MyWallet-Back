import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect()
    db = mongoClient.db("myWallet") 
    console.log("conexão com o banco de dados estabelecida")
} catch (e) {
    console.log("erro ao se conectar com o banco de dados", e)
}

export default db;