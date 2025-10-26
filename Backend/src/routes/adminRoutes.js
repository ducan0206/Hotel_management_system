import express from 'express'
import { uploadCloud } from '../middleware/uploadCloud.js'
import {getAllRooms, addNewRoom, updateRoom, deleteRoom} from '../controllers/adminController.js'

const adminRoute = express.Router();

adminRoute.get("/all-rooms", getAllRooms);

adminRoute.post("/add-room", uploadCloud.single("img"), addNewRoom);

adminRoute.put("/update-room/:id", updateRoom);

adminRoute.delete("/delete-room/:id", deleteRoom);

export default adminRoute