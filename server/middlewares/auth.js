import { application } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import User from "../models/User.js"
let JWT_SECRET = process.env.JWT_SECRET
export let protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if(!token) {
        res.status(400).json({
            success: false,
            msg: "header section empty"
        })
    }
    try {
        let decodedPayload = jwt.verify(token, JWT_SECRET);
        let userId = decodedPayload.userId;
        // converting this userId to the _id since we have converted it to the string
        let objId = new mongoose.Types.ObjectId(userId);

        // now we will find the user with the _id (and this will be in the same try as the error before will not lead this statement to execute)
        let user = await User.findById(objId).select("-password")

        req.user = user;
        next();
    }
    catch(err) {
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}