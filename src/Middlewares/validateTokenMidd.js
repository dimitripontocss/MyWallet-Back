import db from "../Database/DataBase.js"

async function validateToken(req, res, next){
    const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");
	const session = await db.collection("sessions").findOne({ token });
	if(!session){
		res.status(401).send("Ocorreram erros na sua autenticação! Faça Login novamente!");
	}
	res.locals.session = session;

	next();
}

export default validateToken;