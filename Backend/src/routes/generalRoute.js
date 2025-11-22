import express from 'express'
import {getAvailableRooms, getAllRooms, getAllServices} from '../controllers/generalController.js'

const generalRoute = express.Router();

generalRoute.get("/available-rooms", getAvailableRooms);

generalRoute.get("/all-rooms", getAllRooms);

generalRoute.get("/all-services", getAllServices);

export default generalRoute;