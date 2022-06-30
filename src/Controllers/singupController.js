import Joi from "joi";
import bcrypt from "bcrypt";

import db from "../Database/DataBase.js"

export async function signup(req,res){
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
}