import db from '../config/db.js'

export const fetchAllRooms = async() => {
    try {
        const [rows] = await db.query(`select * from rooms`);
        return rows
    } catch (error) {
        console.log('Error: fetchAllRooms function', error.message);
        return error;
    }
}

export const addRoom = async() => {
    
}

export const updatingRoom = async() => {
    
}

export const editingRoom = async() => {
    
}

export const deletingRoom = async() => {
    
}