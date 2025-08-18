import { success } from "zod";
import User from "../models/User.js";


// here we will write a function where the user can be changed to the owner
export let changeToOwner = async (req, res) => {
    try{
        let {_id} = req.user; // here we will get the _id from the protect middleware
        await User.findByIdAndUpdate(_id, {
            role: "owner"
        })
        res.json({
            success: true,
            msg: "Now you can list your cars"
        })
    }
    catch(err) {
        console.log(err.message);
        res.json({
            success: false,
            msg: err.message
        })
    }
}