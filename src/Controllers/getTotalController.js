import {  ObjectId } from "mongodb";

import db from "./dataBaseController.js"

export async function getTotal(req,res){
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");

	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		return res.sendStatus(401);
	}
    
	const userRegisters = await db.collection("registers").find({userId: new ObjectId(session.userId)}).toArray();
	const total = findBalance(userRegisters);
	res.status(200).send({ total });
}

function findBalance(registers){
	let balance = 0;
	for(let i=0;i<registers.length;i++){
		if(registers[i].type === "income"){
			balance += registers[i].amount*1;
		}else{
			balance -= registers[i].amount*1;
		}
	}
	return balance;
}