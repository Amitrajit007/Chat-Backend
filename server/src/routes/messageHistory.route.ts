import { Router } from "express";
import { msgHistoryController } from "../controller/msgHistory.controller";
const router = Router();

router.get("/lastmessages", msgHistoryController);

export default router;
