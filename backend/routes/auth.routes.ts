import { Router } from "express";
import { login, register } from "../controllers/auth.controller.ts";
import { upload } from "../middleware/upload.middleware.ts";

const router = Router();

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);

export default router;
