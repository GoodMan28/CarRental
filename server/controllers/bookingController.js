import Booking from "../models/Bookings.js"

export let checkAvailibility = async (car, pickupDate, returnDate) => {
    let bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate}, // here we are checking any full or partial overlap between the dates
        returnDate: {$gte: pickupDate}
    })

    return bookings.length === 0;
}