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

---

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)  
- MongoDB (local or cloud-based)  

### Steps
1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
