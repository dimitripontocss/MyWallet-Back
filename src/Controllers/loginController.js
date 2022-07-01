import { v4 as uuid } from "uuid"
import bcrypt from "bcrypt";

import db from "../Database/DataBase.js"
import loginSchema from "../JoiSchemas/loginSchema.js";

import ApiError from "../Utils/apiError.js";
import handleError from  "../Utils/handleError.js";

export async function login(req,res){
	try{
		const { email, password } = req.body;
		
		const check = loginSchema.validate(req.body);
		if(check.error){
			throw new ApiError("Prencha todos os campos corretamente.",422);
		}

		const possibleUser = await db.collection("users").findOne({ email });
		if(!possibleUser){
			throw new ApiError("Senha ou email incorretos!",401);
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
			throw new ApiError("Senha ou email incorretos!",401);
		}
	}catch(error){
		console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
	}
}