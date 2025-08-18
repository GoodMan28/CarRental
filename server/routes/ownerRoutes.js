import express from "express"
import { changeToOwner } from "../controllers/ownerController.js";
import { protect } from "../middlewares/auth.js";

export let ownerRouter = express.Router();

// defining the paths

ownerRouter.use(express.json())

ownerRouter.post("/changeToOwner", protect, changeToOwner);