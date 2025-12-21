import express from 'express'
import { uploadCloud } from '../middleware/uploadCloud.js'
import {getAllRooms, getRoomByID, addNewRoom, updateRoom, deleteRoom, createNewRoomType, getAllRoomTypes, updateRoomType, deleteRoomType,
        getAllServices, createNewService, updateService, deleteService, getAllServiceOrder,
        getAllBookings, getBookingByID, updateBooking, createNewBooking, deleteBooking,
        getAllPayments, getPaymentsById, createPayment,
        getAllCustomers, getCustomerInfo, updateCustomerInfo, deleteCustomer,
        createNewReception, getAllReceptions, deleteReception, updateReception, loginReceptionistAccount,
        adminLogin
} from '../controllers/adminController.js'

const adminRoute = express.Router();

// admin authentication
adminRoute.post("/login", adminLogin);

// reception management
adminRoute.post("/reception", createNewReception);

adminRoute.post("/reception/login", loginReceptionistAccount)

adminRoute.get("/reception", getAllReceptions);

adminRoute.delete("/reception/:id", deleteReception);

adminRoute.put("/reception/:id", updateReception);

// room management
adminRoute.get("/all-rooms", getAllRooms);

adminRoute.get("/room/:id", getRoomByID);

adminRoute.post("/add-room", uploadCloud.single("image"), addNewRoom);

adminRoute.put("/update-room/:id", updateRoom);

adminRoute.delete("/delete-room/:id", deleteRoom);

adminRoute.get("/room-types", getAllRoomTypes);

adminRoute.post("/new-room-type", createNewRoomType);

adminRoute.put("/update-room-type/:id", updateRoomType);

adminRoute.delete("/delete-room-type/:id", deleteRoomType);

// service management 
adminRoute.get("/services", getAllServices);

adminRoute.post("/new-service", createNewService);

adminRoute.put("/update-service/:id", updateService);

adminRoute.delete("/delete-service/:id", deleteService);

adminRoute.get("/service-orderd", getAllServiceOrder);

// booking management
adminRoute.get("/bookings", getAllBookings);

adminRoute.get("/bookings/:id", getBookingByID);

adminRoute.put("/bookings/:id/update", updateBooking);

adminRoute.post("/new-bookings", createNewBooking);

adminRoute.delete("/bookings/:id", deleteBooking);

// Payment Management
adminRoute.get("/payments", getAllPayments);

adminRoute.get("/payments/:id", getPaymentsById);

adminRoute.post("/payments", createPayment); // offline payment

// customer management
adminRoute.get("/customers", getAllCustomers);

adminRoute.get("/customer/:id", getCustomerInfo);

adminRoute.put("/customer/:id", updateCustomerInfo);

adminRoute.delete("/customer/:id", deleteCustomer);

export default adminRoute