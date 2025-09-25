import mongoose from "mongoose"
let {ObjectId} = mongoose.Schema.Types
let bookingSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: "User", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    car: {type: ObjectId, ref: "Car", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    price: {type: Number, required: true}
}, {timestamps: true});

// making the model from the schema and exporting it
let Booking = new mongoose.model("Booking", bookingSchema);

export default Booking;