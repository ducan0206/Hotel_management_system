import express from 'express'
import {getAllBooking, getBookingByID, addNewBooking, updateBooking, deleteBooking, 
        createAccount, updateAccount, viewAccount, loginAccount,
        getAllAvailableRooms,
        createNewPayment, getPayment
} from '../controllers/customerController.js'

const customerRoute = express.Router();

// account
customerRoute.post("/customer", createAccount);

customerRoute.post("customer/login", loginAccount);

customerRoute.put("/customer/:id", updateAccount);

customerRoute.get("/customer/:id", viewAccount);

// booking
customerRoute.get("/all-booking/:cus_id", getAllBooking);

customerRoute.get("/booking/:cus_id/:id", getBookingByID);

customerRoute.post("/new-booking", addNewBooking);

customerRoute.put("/booking/:id/update", updateBooking);

customerRoute.delete("/delete-booking", deleteBooking);

// room service
customerRoute.get("/available-rooms", getAllAvailableRooms);

// additional service

// payment 
customerRoute.get("/payment/:booking_id", getPayment);

customerRoute.post("/new-payment/:booking_id", createNewPayment);

export default customerRoute