import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import { login } from "./Controllers/loginController.js";
import { signup } from "./Controllers/singupController.js";
import { getRegisters } from "./Controllers/getRegistersController.js";
import { postRegister } from "./Controllers/postRegistersController.js";
import { getTotal } from "./Controllers/getTotalController.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config()


app.post("/signup", signup);

app.post("/login", login);

app.get("/register", getRegisters);

app.post("/register", postRegister)

app.get("/total", getTotal)


const PORT = process.env.PORTA_SERVER || 5001;
app.listen(PORT, () => {
    console.log("servidor em pé na porta ", process.env.PORTA_SERVER)
})