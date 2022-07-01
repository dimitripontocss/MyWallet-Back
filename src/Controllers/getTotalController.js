export async function getTotal(req,res){
	const userRegisters = res.locals.userRegisters;
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