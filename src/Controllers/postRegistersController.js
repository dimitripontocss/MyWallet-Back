import dayjs from "dayjs"

import db from "../Database/DataBase.js"
import registerSchema from "../JoiSchemas/registerSchema.js";

import ApiError from "../Utils/apiError.js";
import handleError from  "../Utils/handleError.js";

export async function postRegister(req,res){
	try{
		const { amount } = req.body;
		const session = res.locals.session;

		const { error } = registerSchema.validate(req.body);
		if(error){
			throw new ApiError("Você deve preencher os campos corretamente!",422);
		}

		const numberAmout = parseFloat(amount).toFixed(2)
		const date = dayjs().format('DD/MM')
		
		await db.collection("registers").insertOne({ ...req.body,amount: numberAmout, userId: session.userId, date: date});
		res.status(200).send("Transação concluída!");
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