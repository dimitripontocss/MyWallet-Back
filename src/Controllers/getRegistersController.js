import {  ObjectId } from "mongodb";

import db from "./dataBaseController.js"

export async function getRegisters(req,res){
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");

	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		return res.sendStatus(401);
	}
    
	const userRegisters = await db.collection("registers").find({userId: new ObjectId(session.userId)}).toArray();
	res.status(200).send(userRegisters);
}