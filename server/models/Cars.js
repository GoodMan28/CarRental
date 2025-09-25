import mongoose from "mongoose"
let {ObjectId} = mongoose.Schema.Types
let carSchema = new mongoose.Schema({
    ownerId: {type: ObjectId, required: false},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    seatingCapacity: {type: Number, required: true},
    fuelType: {type: String, required: true},
    transmission: {type: String, required: true, enum: ["MT", "AMT", "SMT", "CVT", "HYBRID", ""]},
    pricePerDay: {type: Number, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    isAvailable: {type: Boolean, required: true, default: true},
});

// making the model from the schema and exporting it
let Car = new mongoose.model("Car", carSchema);

export default Car;