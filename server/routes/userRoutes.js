import express from "express"

// importing the controllers which will be the main component of the end points
import { loginUser, registerUser, getUserData, getCars } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

// using the router where we will attach the middlewares and the end points
export let userRouter = express.Router();

// now we will add the endpoints to the userRouter

userRouter.use(express.json());

// using the controllers in the callbacks
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get('/cars', getCars)
userRouter.get("/", (req, res) => {
    res.json({
        msg: "Route is okay"
    })
})
// nowe we will use this router in the server.js