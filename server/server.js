// importing dependencies
import express from "express"
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config"
import { userRouter } from "./routes/userRoutes.js";
import { ownerRouter } from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize express app
let app = express();
app.use(cors())
await connectDB()

app.use(express.json());

// Adding the user routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/owner", ownerRouter);
app.use("/api/v1/booking", bookingRouter);
// routes
app.get('/', (req, res) => {
    res.status(200).send("Server is running")
})

// listening on the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));