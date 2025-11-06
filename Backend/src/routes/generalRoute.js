import express from 'express'
import {getAvailableRooms} from '../controllers/generalController.js'

const generalRoute = express.Router();

generalRoute.get("/available-rooms", getAvailableRooms);

export default generalRoute;