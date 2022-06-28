import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient,ObjectId } from "mongodb";
import Joi from "joi"

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("batepapo_uol");
});

const app = express();

app.use(cors());
app.use(express.json());




app.listen(5000);