import bcrypt from "bcrypt";

import db from "../Database/DataBase.js"
import signupSchema from "../JoiSchemas/signupSchema.js";

import ApiError from "../Utils/apiError.js";
import handleError from  "../Utils/handleError.js";

export async function signup(req,res){
	try{
		const {name, email, password, passwordConfirmation} = req.body;

		
		const { error } = signupSchema.validate(req.body);
		if(error){
			throw new ApiError("Prencha todos os campos corretamente.",422);
		}

		const alreadyExist = await db.collection("users").findOne({ email: email});
		if(alreadyExist){
			throw new ApiError("Este email já entá cadastrado!",400);
		}

		if(password !== passwordConfirmation){
			throw new ApiError("As senhas devem ser iguais!",400);
		}
		const cryptedPassword = bcrypt.hashSync(password, 10);

		await db.collection("users").insertOne({
			name: name,
			email: email,
			password: cryptedPassword
		});
		return res.status(201).send("Usuário registrado com sucesso!");
	}
	catch(error){
		console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
	}
}