import db from '../config/db.js'

// admin
export const fetchAllRooms = async() => {
    try {
        const [rows] = await db.query(
            `
            select r.*, t.type_name, t.capacity
            from Rooms r join RoomType t on r.room_type = t.type_id
            `
        );
        return rows;
    } catch (error) {
        console.log('Error: fetchAllRooms function', error.message);
        return error;
    }
}

export const fetchRoomByID = async(id) => {
    try {
        const [existingRoom] = await db.query(
            `
            select r.*, t.type_name, t.capacity
            from Rooms r join RoomType t on r.room_type = t.type_id
            where r.room_id = ?
            `, [id]
        );
        if(existingRoom.length === 0) {
            throw new Error(`Room with ${id} not found.`);
        }
        return existingRoom[0];
    } catch (error) {
        console.log('Error: fetchRoomByID function', error.message);
        return error;
    }
}

export const addRoom = async({room_number, room_type, price, status, description, image_url}) => {
    try {
        const [type] = await db.query('select type_id from RoomType where type_name = ?', [room_type]);
        if(type.length === 0) {
            throw new Error(`Room Type ${room_type} not existed.`);
        }
        const room_type_id = type[0].type_id;
        const [result] = await db.query(
            "INSERT INTO rooms (room_number, room_type, price, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            [room_number, room_type_id, price, status, description, image_url]
        );
        const [rows] = await db.query(
            `
            select r.*, t.type_name, t.capacity
            from Rooms r join RoomType t on r.room_type = t.type_id
            where r.room_id = ?
            `, [result.insertId]
        );
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
        const [type] = await db.query(`select type_id from RoomType where type_name = ?`, [room_type]);
        if(type.length === 0) {
            throw new Error(`Room type ${room_type} not existed.`);
        }
        const room_type_id = type[0].type_id;
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
            `, [room_number, room_type_id, price, status, description, image_url, id]
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
            delete from Rooms 
            where room_id = ?
            `, [id]
        );
        return {message: `Room with ${id} has been deleted.`}
    } catch (error) {
        console.log('Error: deletingRoom function', error);
        return error;
    }
}

export const fetchAllRoomTypes = async() => {
    try {
        const [rows] = await db.query("select * from RoomType");
        return rows;
    } catch (error) {
        console.log('Error: fetchAllRoomTypes function', error);
        return error;
    }
}

export const addNewRoomType = async({type_name, capacity}) => {
    try {
        const [newType] = await db.query(
            `
            insert into RoomType (type_name, capacity) values (?, ?)
            `, [type_name, capacity]
        );
        const [rows] = await db.query("select * from RoomType where type_id = ?", [newType.insertId]);
        return rows[0];
    } catch (error) {
        console.log('Error: addNewRoomType function', error);
        return error;
    }
}

export const updatingRoomType = async(id, typeData) => {
    try {
        const [existingType] = await db.query("select * from RoomType where type_id = ?", [id]);
        if(existingType.length === 0) {
            throw new Error(`Room type with ${id} not found.`);
        }
        const {type_name, capacity} = typeData;
        await db.query(
            `
            update RoomType
            set type_name = ?,
                capacity = ?
            where type_id = ?
            `, [type_name, capacity, id]
        );
        const [newType] = await db.query("select * from RoomType where type_id = ?", [id]);
        return newType[0];
    } catch (error) {
        console.log('Error: updatingRoomType function', error);
        return error;
    }
}

export const deletingRoomType = async(id) => {
    try {
        const [existingType] = await db.query("select * from RoomType where type_id = ?", [id]);
        if(existingType.length === 0) {
            throw new Error(`Room type with ${id} not found.`);
        }
        const [roomsUsingType] = await db.query(
            "select count(*) as c from Rooms where room_type = ?",
            [id]
        );
        if (roomsUsingType[0].count > 0) {
            throw new Error(`Cannot delete Room Type ID ${id} because it is used by ${roomsUsingType[0].c} room(s).`);
        }
        await db.query(
            `
            delete from RoomType 
            where type_id = ? 
            `, [id]
        )
        return {message: `Room type with id ${id} has been deleted.`}
    } catch (error) {
        console.log('Error: deletingRoomType function', error);
        return error;
    }
}