# Car Rental Backend API

## Project Description
This is the backend API for a car rental application, built with **Node.js** and **Express**.  
It provides all the necessary endpoints to manage users, list and book cars, and handle owner-specific functionalities like adding new vehicles and viewing booking history.  
The application is designed to be robust and secure, with a clear separation of concerns.

---

## Technical Stack
- **Node.js**: Runtime environment  
- **Express.js**: Web framework for building the API  
- **MongoDB**: NoSQL database for data storage  
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB  
- **jsonwebtoken (JWT)**: For user authentication and authorization  
- **bcrypt**: Secure password hashing  
- **Multer**: Middleware for handling file uploads  
- **ImageKit**: Cloud-based image CDN for real-time optimization and delivery  

---

## Features

### User & Authentication
- User registration and login  
- Secure password handling with bcrypt  
- JWT-based authentication for protected routes  
- Fetching a list of all available cars  
- Booking a car for a specific date range  
- Viewing a user's booking history  

### Owner
- Ability to change user role to **"owner"**  
- Add new cars with image uploads and optimization  
- Toggle car availability  
- View a list of owned cars  
- Access dashboard with key metrics (total cars, bookings, revenue)  

### Booking
- API to check for car availability (location + dates)  
- Create new bookings  
- Endpoints for owners to manage their car bookings  
- Change booking status (pending, confirmed, cancelled)  





### API Endpoints
- Note: For detailed request/response bodies, please refer to the controller files.

User Routes (/api/user)

- POST /register: Register a new user.

- POST /login: Log in a user and get a JWT.

- GET /data: Get user data (protected).

- GET /cars: Get all available cars.
- POST /change-role: Change user role to owner (protected).
Owner Routes (/api/owner)

- POST /add-car: Add a new car (protected, requires image file).

- GET /cars: Get cars owned by the user (protected).

- POST /toggle-car: Toggle a car's availability (protected).

- POST /delete-car: Delete a car (protected).

- GET /dashboard: Get dashboard analytics for the owner (protected).

- POST /update-image: Update owner image (protected, requires image file).

Booking Routes (/api/booking)
- POST /check-availability: Check for car availability.

- POST /create: Create a new booking (protected).

- GET /user: Get all user-specific bookings (protected).

- GET /owner: Get all owner-specific bookings (protected).

- POST /change-status: Change booking status (protected).
