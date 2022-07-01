import Joi from "joi";
import dayjs from "dayjs"

import db from "../Database/DataBase.js"
import registerSchema from "../JoiSchemas/registerSchema.js";

export async function postRegister(req,res){
	const { amount } = req.body;
	const session = res.locals.session;

	const { error } = registerSchema.validate(req.body);
	if(error){
		return res.status(422).send("Você deve preencher os campos corretamente!");
	}

	const numberAmout = parseFloat(amount).toFixed(2)
	const date = dayjs().format('DD/MM')
	
	await db.collection("registers").insertOne({ ...req.body,amount: numberAmout, userId: session.userId, date: date});
	res.status(200).send("Transação concluída!");
}