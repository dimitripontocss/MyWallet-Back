import db from "../Database/DataBase.js"

import ApiError from "../Utils/apiError.js";
import handleError from  "../Utils/handleError.js";

async function validateToken(req, res, next){
	try{
		const { authorization } = req.headers;
		const token = authorization?.replace("Bearer ", "");
		const session = await db.collection("sessions").findOne({ token });
		if(!session){
			throw new ApiError("Ocorreram erros na sua autenticação! Faça Login novamente!",401);
		}
		res.locals.session = session;

		next();
	}catch(error){
		console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
	}
}

export default validateToken;