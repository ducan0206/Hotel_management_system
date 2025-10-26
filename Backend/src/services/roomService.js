import db from '../config/db.js'

// admin
export const fetchAllRooms = async() => {
    try {
        const [rows] = await db.query(`select * from rooms`);
        return rows;
    } catch (error) {
        console.log('Error: fetchAllRooms function', error.message);
        return error;
    }
}

export const addRoom = async({room_number, room_type, price, status, description, image_url}) => {
    try {
        const [result] = await db.query(
            "INSERT INTO rooms (room_number, room_type, price, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            [room_number, room_type, price, status, description, image_url]
        );
        const [rows] = await db.query("SELECT * FROM rooms WHERE room_id = ?", [result.insertId]);
        return rows[0];
    } catch (error) {
        console.log('Error: addRoom function', error.message);
        return error;
    }
};

export const updatingRoom = async(id, roomData) => {
    try {
        const [existingRoom] = await db.query("select * from rooms where room_id = ?", [id]);
        if(existingRoom.length === 0) {
            throw new Error(`Room with ${id} note found.`);
        }

        const {room_number, room_type, price, status, description, image_url} = roomData;

        await db.query(
            `
            update rooms
            set room_number = ?,
                room_type = ?,
                price = ?,
                status = ?,
                description = ?,
                image_url = ?
            where room_id = ?
            `, [room_number, room_type, price, status, description, image_url, id]
        );

        const [rows] = await db.query("select * from rooms where room_id = ?", [id]);
        return rows[0];
    } catch (error) {
        console.log('Error: updatingRoom function', error.message);
        return error;
    }
}

export const deletingRoom = async(id) => {
    try {
        const [existingRoom] = await db.query("select * from rooms where room_id = ?", [id]);
        if(existingRoom.length === 0) {
            throw new Error(`Room with ${id} not found.`);
        }
        await db.query(
            `
            delete from rooms 
            where room_id = ?
            `, [id]
        );
        return {message: `Room with ${id} has been deleted.`}
    } catch (error) {
        console.log('Error: deletingRoom function', error);
        return error;
    }
}