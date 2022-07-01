import bcrypt from "bcrypt";

import db from "../Database/DataBase.js"
import signupSchema from "../JoiSchemas/signupSchema.js";

export async function signup(req,res){
    const {name, email, password, passwordConfirmation} = req.body;

    
	const { error } = signupSchema.validate(req.body);
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