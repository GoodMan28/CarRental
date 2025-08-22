import express from "express"
import { changeToOwner, listCar } from "../controllers/ownerController.js";
import { protect } from "../middlewares/auth.js";
import multer from "multer";
import upload from "../middlewares/multer.js";
export let ownerRouter = express.Router();

// defining the paths

ownerRouter.use(express.json())

ownerRouter.post("/changeToOwner", protect, changeToOwner);
ownerRouter.post("/addCar", protect, upload.single("image"), listCar);
// we will provide the image in the body with the "image" property