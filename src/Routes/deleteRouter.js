import { Router } from "express";
import validateToken from "../Middlewares/validateTokenMidd.js";
import { deleteController } from "../Controllers/deleteController.js";

const router = Router();
router.delete("/delete/:idRegister",validateToken,deleteController);
export default router;