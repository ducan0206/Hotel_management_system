import express from 'express'
import {getAvailableRooms, getAllRooms} from '../controllers/generalController.js'

const generalRoute = express.Router();

generalRoute.get("/available-rooms", getAvailableRooms);

generalRoute.get("/all-rooms", getAllRooms);

export default generalRoute;