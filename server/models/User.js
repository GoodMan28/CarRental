import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    name: {type:String, required: true },
    email: {type:String, required: true, unique: true},
    password: {type:String, required: true },
    role: {type:String, enum:["user", "owner"], default:"user"},
    image: {type:String, default:""}
}, {timestamps:true})

let User = mongoose.model("User", userSchema);
export default User;