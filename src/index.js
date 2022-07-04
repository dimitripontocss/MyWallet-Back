import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import loginRouter from "./Routes/loginRouter.js";
import signupRouter from "./Routes/signupRouter.js";
import registerRouter from "./Routes/registerRouter.js";
import totalRouter from "./Routes/totalRouter.js";
import deleteRouter from "./Routes/deleteRouter.js"

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(loginRouter);
app.use(signupRouter);
app.use(registerRouter);
app.use(totalRouter);
app.use(deleteRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("servidor em pé na porta ", process.env.PORT)
})