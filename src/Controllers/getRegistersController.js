export async function getRegisters(req,res){  
	const userRegisters = res.locals.userRegisters; 
	res.status(200).send(userRegisters.reverse());
}