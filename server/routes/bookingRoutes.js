import express from "express" 
import { changeBookingStatus, checkAvailibilityLocation, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";
let bookingRouter = express.Router();
bookingRouter.use(express.json());

bookingRouter.post("/availableCars", checkAvailibilityLocation);
bookingRouter.post("/createBooking", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/changeStatus", protect, changeBookingStatus);

export default bookingRouter;