import fs from "fs";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import { response } from "express";
import Car from "../models/Cars.js";


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
        let {_id} = req.user; // give by the protect middleware
        let car = JSON.parse(req.body.carData); // we will pass the car data by the body
        let imageFile = req.file; // this is given by the multer middleware
        let fileBuffer = fs.readFileSync(imageFile.path); // the path property is given by the multer middleware


        // Now we will use the upload property of the imageKit to upload the file. Read Docs
        let response = await imagekit.upload({
            file: fileBuffer,
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
