import express from "express"
import { allCar, changeToOwner, deleteCar, getDashboardData, listCar, toggleAvail, updatePhoto } from "../controllers/ownerController.js";
import { protect } from "../middlewares/auth.js";
import multer from "multer";
import upload from "../middlewares/multer.js";
export let ownerRouter = express.Router();

// defining the paths

ownerRouter.use(express.json())

ownerRouter.post("/changeToOwner", protect, changeToOwner);
ownerRouter.post("/addCar", protect, upload.single("image"), listCar);
ownerRouter.post("/allCar", protect, allCar)
ownerRouter.post("/toggleAvailibility", protect, toggleAvail);
ownerRouter.post("/deleteCar", protect, deleteCar)
ownerRouter.post("/dashboard", protect, getDashboardData)
ownerRouter.post("/updatePhoto", protect, upload.single("image"), updatePhoto)
// we will provide the image in the body with the "image" property