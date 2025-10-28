import express from 'express'
import { uploadCloud } from '../middleware/uploadCloud.js'
import {getAllRooms, getRoomByID, addNewRoom, updateRoom, deleteRoom, createNewRoomType, getAllRoomTypes, updateRoomType, deleteRoomType,
        getAllServices, createNewService, updateService, deleteService, getAllServiceOrder,
        getAllBookings, getBookingByID, updateBooking, createNewBooking, deleteBooking
} from '../controllers/adminController.js'


const adminRoute = express.Router();

// room management
adminRoute.get("/all-rooms", getAllRooms);

adminRoute.get("/room/:id", getRoomByID);

adminRoute.post("/add-room", uploadCloud.single("img"), addNewRoom);

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

export default adminRoute