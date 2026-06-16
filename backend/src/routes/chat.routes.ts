import { Router } from "express";
import { handleMessage, getHistory } from "../controllers/chat.controller";

const router = Router();

router.post("/message", handleMessage);
router.get("/history/:sessionId", getHistory);

export default router;
