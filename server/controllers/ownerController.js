import fs from "fs";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import { response } from "express";
import Car from "../models/Cars.js";
import mongoose from "mongoose";


// API to change the role to owner
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

// API to list the cars
export let listCar = async (req, res) => {
    try {
        let {_id} = req.user; // given by the protect middleware
        let car = JSON.parse(req.body.carData); // we will pass the car data in the form (and in form we can either provide the text data or file so parsing it to json)
        let imageFile = req.file; // this is given by the multer middleware
        let fileBuffer = fs.readFileSync(imageFile.path); // the path property is given by the multer middleware


        // Now we will use the upload property of the imageKit to upload the file. Read Docs
        let response = await imagekit.upload({
            file: fileBuffer, // we have stored the image file into a buffer
            fileName: imageFile.originalname,
            folder: "/cars"
        })
        // the response will have 3 properties: url, fileId, filePath
        // optimization of the file thru the imagekit url property (we needed to transform thats why we used this property)
        let optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: "1280"}, // width resizing
                {quality: "auto"}, // Auto compression
                {format: "webp"}  // changing the format
            ]
        });

        // adding the car data and the url to the database
        let carDocument = await Car.create({...car, image: optimizedImageURL, ownerId: _id});

        res.json({
            success: true,
            msg: "Car added",
            carDocument
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

// API to give the list of all cars listed by the ownwer
export let allCar = async (req, res) => {
    try {
        let {_id} = req.user;
        let cars = await Car.find({ownerId: _id}).lean();

        if(!cars) {
            res.json({
                "success": false,
                "msg": "No cars listed by the user"
            })
        }

        res.json({
            "success": true,
            cars
        })
    }
    catch(err) {
        res.json({
            "success": true,
            "msg" : err.message
        })
    }
}


// API to toggle car availibility
export let toggleAvail = async (req, res) => {
    try {
        let {_id} = req.user;
        // we will provide the car id of the car whoose availibility to be changed in the body
        let {carId} = req.body;
        let carObjid = new mongoose.Types.ObjectId(carId);
        let car = await Car.findById(carObjid);
        
        if(!car) {
            res.status(403).json({
                "success": false,
                "msg" : "Car not present"
            })
        }

        // checking whether the car belongs to the owner
        if(car.ownerId.toString() !== _id.toString()) {
            // convert to the string because two object id can never be same because in === we also compare to the memory reference they point to
            console.log(car.ownerId, _id)
            res.status(403).json({
                "success": false,
                "msg": "The car doesn't belong to the owner, Unautorized"
            })
        }
        await Car.findByIdAndUpdate(carObjid, {isAvailable: !car.isAvailable}); // since the isAvailbale is of the old document
        res.json({
            "success": true,
            msg: "availibility changed"
        })
    }
    catch(err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to delete the cars (we will pass which car to remove in the body)
// here we will make the owner id of the car as null becuase suppose a user has booked and the owner deleted this car so this should be visible to the user
// v2 => also add a select option where we can perform the same operations on multiple cars
export let deleteCar = async (req, res) => {
    try {
        let {_id} = req.user;
        // we will provide the car id of the car whoose availibility to be changed in the body
        let {carId} = req.body;
        let carObjid = new mongoose.Types.ObjectId(carId);
        let car = await Car.findById(carObjid);
        
        if(!car) {
            res.status(403).json({
                "success": false,
                "msg" : "Car not present"
            })
        }

        // checking whether the car belongs to the owner
        if(car.ownerId.toString() !== _id.toString()) {
            // convert to the string because two object id can never be same because in === we also compare to the memory reference they point to
            res.status(403).json({
                "success": false,
                "msg": "The car doesn't belong to the owner, Unauthorized"
            })
        }

        car.ownerId = null;
        car.isAvailable = false;
        await car.save();
        res.json({
            "success": true,
            "msg": "The car info is deleted from owner's portfolio"
        })
    }
    catch(err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}

// API to get the dashboard data
export let getDashboardData = async (req, res) => {
    try {
        let {_id, role} = req.user;
        if(role !== "owner") {
            res.status(403).send({
                "success": false,
                "msg": "unauthorized"
            })
        }

        let cars = Car.find({ownerId: _id});
        // later we will also display the bookings data
    }
    catch(err) {
        res.json({
            "success": false,
            "msg": err.message
        })
    }
}






// {
//   fieldname: 'image',
//   originalname: 'car.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',
//   filename: '1692702893912-car.jpg',
//   path: 'uploads/1692702893912-car.jpg',
//   size: 34567
// }
// When you use Multer, the req.file object looks something like this (if you’re using diskStorage):
