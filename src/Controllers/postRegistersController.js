import Joi from "joi";
import dayjs from "dayjs"

import db from "../Database/DataBase.js"

export async function postRegister(req,res){
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
}