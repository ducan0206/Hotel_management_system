import db from '../config/db.js'
import {getAllAvailableRooms} from '../services/roomService.js'

export const getAvailableRooms = async(request, response) => {
    try {
        const rooms = await getAllAvailableRooms();
        if(rooms.status !== 200) {
            response.status(rooms.status).json(rooms.message);
        }
        response.status(200).json(rooms.data);
    } catch (error) {
        console.log('Error: getAvailableRooms function', error.message);
        response.status(500).json({message: 'System error'});
    }
}