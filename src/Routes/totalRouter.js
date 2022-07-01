import { Router } from "express";
import { getTotal } from "../Controllers/getTotalController.js";
import validateToken from "../Middlewares/validateTokenMidd.js";
import getRegistersMidd from "../Middlewares/getRegistersMidd.js";

const router = Router();
router.get("/total", validateToken,getRegistersMidd, getTotal)
export default router;