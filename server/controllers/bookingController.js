import { Stats } from "fs";
import Booking from "../models/Bookings.js"
import Car from "../models/Cars.js";

// function to check the availibility of a car at a given date
export let checkAvailibility = async (car, pickupDate, returnDate) => {
    let bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate }, // here we are checking any full or partial overlap between the dates
        returnDate: { $gte: pickupDate }
    })

    return bookings.length === 0;
}

// API to give a list of available cars at a given date and location
export let checkAvailibilityLocation = async (req, res) => {
    try {
        let { location, pickupDate, returnDate } = req.body;
        let cars = await Car.find({
            location,
            isAvailable: true
        });

        let availableCarsPromises = cars.map(async (car) => {
            let isAvailable = await checkAvailibility(car._id, pickupDate, returnDate); // checking the availibility using the dates
            return { ...car.doc, isAvailable: isAvailable }; // we used the _doc because the mongo db returns a mongo document object consisting of internal fields like _v, schema, _doc so by doing the "._doc" we convert it into plain JS object

            // IMP: when we use async await syntax in the map, we will get an array of promises so we will resolve all the promises of the array with the Promise.all syntax
            // REFER: https://chatgpt.com/share/68b1b7e2-6ce0-8013-8816-dd2bf6e3f0c4
            // https://www.w3schools.com/js/js_promise.asp
        })

        let availableCars = await Promise.all(availableCarsPromises);
        // now filtering all the available cars from the availableCars
        availableCars = availableCars.filter((car) => {
            return car.isAvailable === true
        })

        console.log(cars);
        res.json({
            "success": true,
            "cars": availableCars
        })
    }
    catch (err) {
        console.log(err.message);
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to create booking
export let createBooking = async (req, res) => {
    // https://gist.github.com/GoodMan28/54a2bb29f95f93866f615c64da199aa1   Alternate code
    try {
        let { car, pickupDate, returnDate } = req.body;
        let isAvailable = checkAvailibility(car, pickupDate, returnDate);
        let { _id } = req.user; // userId from the middleware
        if (!isAvailable) {
            res.json({
                "success": false,
                "msg": "Car not available"
            });
        }

        let carDetails = await Car.findById(car);
        let ownerId = carDetails.owner;
        if (!ownerId) {
            res.json({ 
                "success": false, 
                "msg": "Car doesn't has anyone" 
            });
        }
        let picked = new Date(pickupDate);
        let returned = new Date(returnDate);
        let days = Math.ceil((returned - picked) / (60 * 60 * 24 * 1000));
        let price = Math.ceil(days * carDetails.pricePerDay);

        Booking.create({
            owner: ownerId,
            user: _id,
            car: car,
            pickupDate: pickupDate,
            returnDate: returnDate,
            price: price
        })

        res.json({ 
            "success": true, 
            "msg": "Booking created" 
        });
    }
    catch (err) {
        res.json({ 
            "success": false, 
            "msg": err.message 
        });
    }
}

// API to list all the bookings by the user
export let getUserBookings = async (req, res) => {
    try {
        let { _id } = req.user;
        let bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 }); // descending order that means newest to oldest

        res.json({
            "success": true,
            "msg": "All the bookings by user",
            bookings
        })
    }
    catch (err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to get the owner's booking history
export let getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            res.json({ 
                "success": true, 
                "msg": "The person is not an owner" 
            })
        }
        let { _id } = req.user; // from the protect middlware
        let bookings = await Booking.find({ owner: _id }).populate("car user").select("-user.password").sort({ createdAt: -1 });

        res.json({ "success": true, msg: "All the bookings by owner", bookings });
    }
    catch (err) {
        res.json({ 
            "success": false, 
            "msg": err.message 
        });
    }
}

// API to change the booking status
export let changeBookingStatus = async (req, res) => {
    try {
        let { _id } = req.user;
        let {bookingId, newStatus} = req.body;
        // checking whether the owner of this booking is the owner or not
        let booking = await Booking.findById(bookingId);
        if(booking.owner.toString() !== _id.toString()) {
            res.json({
                "success": false,
                "msg": "Unauthorized"
            })
        }

        let updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            status: newStatus
        })

        res.json({
            "success": true,
            "msg": `Status changed ${updatedBooking.status}`
        })
    }
    catch (err) {
        res.json({ 
            "success": false, 
            "msg": err.message 
        });
    }
}