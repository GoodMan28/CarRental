import Booking from "../models/Bookings.js"
import Car from "../models/Cars.js";

// function to check the availibility of a car at a given date
export let checkAvailibility = async (car, pickupDate, returnDate) => {
    let bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate}, // here we are checking any full or partial overlap between the dates
        returnDate: {$gte: pickupDate}
    })

    return bookings.length === 0;
}

// API to give a list of available cars at a given date and location
export let checkAvailibilityLocation = async (req, res) => {
    try {
        let {location, pickupDate, returnDate} = req.body;
        let cars = await Car.find({
            location,
            isAvailable: true
        });

        let availableCarsPromises = cars.map(async (car) => {
            let isAvailable = await checkAvailibility(car._id, pickupDate, returnDate); // checking the availibility using the dates
            return {...car.doc, isAvailable: isAvailable}; // we used the _doc because the mongo db returns a mongo document object consisting of internal fields like _v, schema, _doc so by doing the "._doc" we convert it into plain JS object

            // IMP: when we use async await syntax in the map, we will get an array of promises so we will resolve all the promises of the array with the Promise.all syntax
            // REFER: https://chatgpt.com/share/68b1b7e2-6ce0-8013-8816-dd2bf6e3f0c4
            // https://www.w3schools.com/js/js_promise.asp
        })

        let availableCars = await Promise.all(availableCarsPromises);
        // now filtering all the available cars from the availableCars
        availableCars = availableCars.filter((car) => {
            return car.isAvailable === true
        })

        // now we will check the availibility of each of the cars in the array
        console.log(cars);
        res.json({
            "success": true,
            "cars": availableCars
        })
    }
    catch(err) {
        console.log(err.message);
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to create booking
export let createBooking = async (req, res) => {
    try {
        let {_id} = req.user;
        let {car, pickupDate, returnDate} = req.body;

        let isAvailable = await checkAvailibility(car, pickupDate, returnDate); // just for safety because we will provide a list of available cars to the users only
        if(!isAvailable) {
            res.status(403).send({
                "success": false,
                "msg": "Car is not available"
            })
        }

        // from where we will get the price: from looking into the car model using the car id
        let {pricePerDay, ownerId} = await Car.findById(car);
        let picked = new Date(pickupDate);
        let returned = new Date(returnDate);
        let days = Math.ceil((returned-picked)/(1000*60*60*24));
        let price = Math.ceil(days * pricePerDay);

        if(!ownerId) {
            res.json({
                "success": false,
                "msg": "this car belongs to none"
            })
            return;
        }

        await Booking.create({
            owner: ownerId,
            car: car,
            user: _id,
            pickupDate,
            returnDate,
            price
        })

        res.json({
            "success": true,
            "msg": "Booking created"
        })
    }
    catch(err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to list all the bookings by the user
export let getUserBookings = async (req, res) => {
    try {
        let {_id} = req.user; 
        let bookings = await Booking.find({ user:_id }).populate("car").sort({createdAt: -1}); // descending order that means newest to oldest

        res.json({
            "success": true,
            "msg": "All the bookings",
            bookings
        })
    }
    catch(err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}
