import db from "../Database/DataBase.js"

import { ObjectId } from "mongodb";

import ApiError from "../Utils/apiError.js";
import handleError from  "../Utils/handleError.js";

export async function deleteController(req,res){
    try{
        const session = res.locals.session;
        const idRegister = req.params.idRegister;

        const possibleRegister = await db.collection("registers").findOne({ _id: new ObjectId(idRegister) });
        if(!possibleRegister){
            throw new ApiError("Ocorreram erros na solicitação!",404);
        }
        if(session.userId.toString() === possibleRegister.userId.toString()){
            await db.collection("registers").deleteOne({ _id: new ObjectId(idRegister) });
            res.sendStatus(200);
        }else{
            console.log("aqui")
            throw new ApiError("Ocorreram erros na solicitação!",404);
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