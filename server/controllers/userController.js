// here we will define the sign up and the sign in logic(functions)
import { email, safeParse, success, z } from "zod"
import User from "../models/User.js";
import Car from "../models/Cars.js"
import { fa } from "zod/v4/locales";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
let JWT_SECRET = process.env.JWT_SECRET;

// function for generating the token
function generateToken(userId) {
    let token = jwt.sign({
        userId: userId
    }, JWT_SECRET);
    return token;
}                           

// API for registering the user
export let registerUser = async (req, res) => {
    // first defining the format of everything which is required
    let requiredBody = z.object({
        name: z.string().min(3).max(100),
        email: z.string().min(3).max(100).email(),
        password: z.string().min(8).max(100)
    })

    let parsedResult = requiredBody.safeParse(req.body);
    if (parsedResult.success) {
        let { name, email, password } = parsedResult.data; // by this we are able to ensure that we are using the safely parsed data
        // now we will be using the bcrypt
        let hash = await bcrypt.hash(password, 10);

        try {
            let user = await User.create({
                name: name,
                email: email,
                password: hash
            })

            // simultaneously generating the tokens
            let token = generateToken(user._id.toString());
            return res.json({
                success: true,
                token,
                msg: "User is signed up"
            })
        }
        catch (err) {
            res.status(402).json({
                success: false,
                msg: "User Already Exists"
            })
        }
    }
    else {
        res.status(404).json({
            success: false,
            msg: parsedResult.error.message
        })
    }
}

// signin the user
export let loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                msg: "No such user exists"
            })
        }

        // now we will compare the password
        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(404).json({
                success: false,
                msg: "Invalid Credentials"
            })
        }
        // now we will generate the token
        let token = generateToken(user._id.toString());

        return res.json({
            success: true,
            msg: "User is signed in",
            token
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}

// now here we will write the endpoint to get the user data
// before it we will use a middleware where the 
// authentication will take place and the 
// we will get the whole user coupled with the req object

export let getUserData = async (req, res) => {
    try {
        let user = req.user;
        return res.json({
            success: true,
            user
        })
    }
    catch(err) {
        return res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvailable: true})
        return res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, msg: error.message})
    }
}