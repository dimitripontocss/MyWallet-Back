import { Router } from "express";
import { signup } from "../Controllers/signupController.js";

const router = Router();
router.post("/signup", signup);

export default router;
