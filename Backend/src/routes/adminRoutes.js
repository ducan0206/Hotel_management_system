import express from 'express'
import { uploadCloud } from '../middleware/uploadCloud.js'
import {getAllRooms, getRoomByID, addNewRoom, updateRoom, deleteRoom, createNewRoomType, getAllRoomTypes, updateRoomType, deleteRoomType} from '../controllers/adminController.js'

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

export default adminRoute