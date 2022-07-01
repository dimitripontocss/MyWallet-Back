import db from "../Database/DataBase.js"

import { ObjectId } from "mongodb";

async function getRegisters(req, res, next){
    const session = res.locals.session;  
	const userRegisters = await db.collection("registers").find({userId: new ObjectId(session.userId)}).toArray();
	res.locals.userRegisters = userRegisters;

	next();
}

export default getRegisters;