import express from "express";
import chatWithMedicalBot  from "../controllers/medicalAIAssistant.js";
const medicalRouter = express.Router();


medicalRouter.post("/medical-chat", chatWithMedicalBot);

export default medicalRouter
