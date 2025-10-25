import express from 'express'
import {getAllRooms, addNewRoom, updateRoom, editRoom, deleteRoom} from '../controllers/adminController.js'

const adminRoute = express.Router();

adminRoute.get("/all-rooms", getAllRooms);

adminRoute.post("/add-room", addNewRoom);

adminRoute.put("/update-room", updateRoom);

adminRoute.patch("/edit-room", editRoom);

adminRoute.delete("/delete-room", deleteRoom);

export default adminRoute