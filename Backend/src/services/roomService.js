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

export const addRoom = async({room_number, room_type, price, status, description, img_url}) => {
    try {
        const [result] = await db.query("insert into rooms (room_number, room_type, price, status, description, image_url) values (?, ?, ?, ?, ?, ?)",
                                        [room_number, room_type, price, status, description, img_url]
        );
        const [rows] = await db.query("select * from rooms where room_id = ?", [result.insertId]);
        console.log(rows);
        return rows[0];
    } catch (error) {
        console.log('Error: addRoom function', error.message);
        return error;
    }
}

export const updatingRoom = async() => {
    
}

export const editingRoom = async() => {
    
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