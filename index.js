import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt"
import Joi from "joi";
import { v4 as uuid } from "uuid"
import dayjs from "dayjs";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});

const app = express();

app.use(cors());
app.use(express.json());


app.post("/signup", async (req,res)=>{
    const {name, email, password, passwordConfirmation} = req.body;

    const registerSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		passwordConfirmation: Joi.string().required()
	});
	const { error } = registerSchema.validate(req.body);
	if(error){
		return res.status(422).send("Prencha todos os campos corretamente.");
	}

	const alreadyExist = await db.collection("users").findOne({ email: email});
	if(alreadyExist){
		return res.status(400).send("Este email já entá cadastrado!")
	}

	if(password !== passwordConfirmation){
		return res.status(400).send("As senhas devem ser iguais!");
	}
	const cryptedPassword = bcrypt.hashSync(password, 10);

	await db.collection("users").insertOne({
		name: name,
		email: email,
		password: cryptedPassword
	});
	return res.status(201).send("Usuário registrado com sucesso!");
})

app.post("/login", async (req,res)=>{
	const { email, password } = req.body;

    const loginSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});
	const check = loginSchema.validate(req.body);
	if(check.error){
		return res.status(422).send("Prencha todos os campos corretamente.");
	}

	const possibleUser = await db.collection("users").findOne({ email: email});
	if(!possibleUser){
		return res.status(401).send("Senha ou email incorretos!");
	}
	const passwordValidate = bcrypt.compareSync(password, possibleUser.password);
	if(passwordValidate){
		const token = uuid();

		await db.collection("sessions").insertOne({
			token,
			userId: possibleUser._id
		})
		return res.status(201).send(
			{
				token: token,
				name:possibleUser.name
			});
	}else{
		return res.status(401).send("Senha ou email incorretos!");
	}
})

app.get("/register", async (req,res)=>{
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");

	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		return res.sendStatus(401);
	}
    
	const userRegisters = await db.collection("registers").find({userId: new ObjectId(session.userId)}).toArray();
	res.status(200).send(userRegisters);
})

app.post("/register", async (req,res)=>{
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");
	const { amount, description, type} = req.body;

	const registerSchema = Joi.object({
		amount: Joi.number().required(),
		description: Joi.string().required(),
		type: Joi.string().required().valid("income", "outcome")
	})

	const { error } = registerSchema.validate(req.body);
	if(error){
		return res.status(422).send("Você deve preencher os campos corretamente!");
	}
	
	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		res.status(401).send("Ocorreram erros na sua autenticação! Faça Login novamente!");
	}

	const numberAmout = parseFloat(amount).toFixed(2)
	const date = dayjs().format('DD/MM')
    
	await db.collection("registers").insertOne({ ...req.body,amount: numberAmout, userId: session.userId, date: date});
	res.status(200).send("Transação concluída!");
})

app.get("/total", async (req,res)=>{
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");

	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		return res.sendStatus(401);
	}
    
	const userRegisters = await db.collection("registers").find({userId: new ObjectId(session.userId)}).toArray();
	const total = findBalance(userRegisters);
	res.status(200).send({ total });
})
function findBalance(registers){
	let balance = 0;
	for(let i=0;i<registers.length;i++){
		if(registers[i].type === "income"){
			balance += registers[i].amount*1;
		}else{
			balance -= registers[i].amount*1;
		}
	}
	return balance;
}


const PORT = process.env.PORTA_SERVER || 5001;
app.listen(PORT);