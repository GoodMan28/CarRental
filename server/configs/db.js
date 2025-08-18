import mongoose from "mongoose"

let connectDB = async () => {
    try {
        // created an event on the DB connection
        // mongoose.connection.on('connected', () => console.log("DB connected"));
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("DB connected");
    }
    catch(err) {
        console.log(err.message);
    }
}

export default connectDB;