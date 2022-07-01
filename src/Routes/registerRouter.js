import { Router } from "express";
import { getRegisters } from "../Controllers/getRegistersController.js";
import { postRegister } from "../Controllers/postRegistersController.js";
import validateToken from "../Middlewares/validateTokenMidd.js";
import getRegistersMidd from "../Middlewares/getRegistersMidd.js";

const router = Router();
router.get("/register",validateToken, getRegistersMidd, getRegisters);
router.post("/register",validateToken, postRegister);

export default router;
