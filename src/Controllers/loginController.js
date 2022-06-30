import { v4 as uuid } from "uuid"
import Joi from "joi";
import bcrypt from "bcrypt";

import db from "../Database/DataBase.js"

export async function login(req,res){
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
}