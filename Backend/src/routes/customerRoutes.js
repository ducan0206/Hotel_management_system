import express from 'express'
import {getAllBooking, getBookingByID, addNewBooking, updateBooking, deleteBooking} from '../controllers/customerController.js'

const customerRoute = express.Router();

customerRoute.get("/all-booking", getAllBooking);

customerRoute.get("/booking/:id", getBookingByID);

customerRoute.post("/new-booking", addNewBooking);

customerRoute.put("/booking/:id/update", updateBooking);

customerRoute.delete("/delete-booking", deleteBooking);

export default customerRoute