// importing dependencies
import express from "express"
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config"
import { userRouter } from "./routes/userRoutes.js";
import { ownerRouter } from "./routes/ownerRoutes.js";

// Initialize express app
let app = express();

// connect DB
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Adding the user routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/owner", ownerRouter);
// routes
app.get('/', (req, res) => {
    res.status(200).send("Server is running")
})

// listening on the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));