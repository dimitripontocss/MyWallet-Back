import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient,ObjectId } from "mongodb";
import Joi from "joi"

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("myWallet");
});

const app = express();

app.use(cors());
app.use(express.json());


app.post("/signup", async (req,res)=>{
    const {name, email, password, passwordConfirmation} = req.body;

    const registerSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required(),
		passwordConfirmation: Joi.string().required()
	});
	const check = registerSchema.validate(req.body);
	if(check.error){
		return res.status(422).send("Prencha todos os campos corretamente.");
	}

	const alreadyExist = await db.collection("users").findOne({ email: email});
	if(alreadyExist){
		return res.status(400).send("Este email já entá cadastrado!")
	}

	if(password === passwordConfirmation){
		await db.collection("users").insertOne({
			name: name,
			email: email,
			password: password
		});
		return res.status(201).send("Usuário registrado com sucesso!");
	}else{
		return res.status(400).send("As senhas devem ser iguais!");
	}
})

app.post("/login", async (req,res)=>{
	const { email, password } = req.body;

    const loginSchema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required(),
	});
	const check = loginSchema.validate(req.body);
	if(check.error){
		return res.status(422).send("Prencha todos os campos corretamente.");
	}

	const possibleUser = await db.collection("users").findOne({ email: email});
	if(!possibleUser){
		return res.status(404).send("Email não cadastrado!");
	}
	if(possibleUser.password === password){
		console.log()
	}
})


app.listen(process.env.PORTA_SERVER);