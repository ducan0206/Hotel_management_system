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
            "insert into Rooms (room_number, room_type, price, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
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

// problem: what if just update status
export const updatingRoom = async(id, roomData) => {
    try {
        const [existingRoom] = await db.query("select * from Rooms where room_id = ?", [id]);
        if(existingRoom.length === 0) {
            throw new Error(`Room with ${id} not found.`);
        }
        const old = existingRoom[0];
        const updated = {
            room_number: roomData.room_number ?? old.room_number,
            room_type: roomData.room_type ?? old.room_type,
            price: roomData.price ?? old.price,
            status: roomData.status ?? old.status,
            description: roomData.description ?? old.description,
            image_url: roomData.image_url ?? old.image_url
        };
        let room_type = updated.room_type;
        const [type] = await db.query(`select type_id from RoomType where type_name = ?`, [room_type]);
        if(type.length === 0) {
            throw new Error(`Room type ${room_type} not existed.`);
        }
        const room_type_id = type[0].type_id;
        await db.query(
            `
            update Rooms
            set room_number = ?,
                room_type = ?,
                price = ?,
                status = ?,
                description = ?,
                image_url = ?
            where room_id = ?
            `, [updated.room_number, room_type_id, updated.price, updated.status, updated.description, updated.image_url, id]
        );
        const [rows] = await db.query("select * from Rooms where room_id = ?", [id]);
        return rows[0];
    } catch (error) {
        console.log('Error: updatingRoom function', error.message);
        return error;
    }
}

export const deletingRoom = async(id) => {
    try {
        const [existingRoom] = await db.query("select * from Rooms where room_id = ?", [id]);
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
        console.log('Error: deletingRoom function', error.message);
        return error;
    }
}

export const fetchAllRoomTypes = async() => {
    try {
        const [rows] = await db.query("select * from RoomType");
        return rows;
    } catch (error) {
        console.log('Error: fetchAllRoomTypes function', error.message);
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
        console.log('Error: addNewRoomType function', error.message);
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
        console.log('Error: updatingRoomType function', error.message);
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
        return {message: `Room type with id ${id} has been deleted.`};
    } catch (error) {
        console.log('Error: deletingRoomType function', error.message);
        return error;
    }
}

// customer
export const getAvailableRooms = async(data) => {
    try {   
        const {check_in, check_out} = data;
        if(!check_in || !check_out) {
            return {
                status: 400,
                message: 'Both check_in and check_out are required'
            }
        }
        const [rooms] = await db.query(
            `
            select r.room_number, t.type_name, t.capacity, r.price, r.description, r.image_url
            from Rooms r join RoomType t on r.room_type = t.type_id
            where r.room_id not in (
                select d.room_id
                from Bookings b join BookingDetails d on b.booking_id = d.booking_id
                where b.status not in ('cancelled', 'checked_out') and (b.check_in < ? and b.check_out > ?)
            ) and r.status = 'available'
            `, [check_in, check_out]
        )
        if(rooms.length === 0) {
            return {
                status: 404,
                message: `No available rooms for this selected dates.`
            }
        }
        return {
            status: 200,
            data: rooms
        }
    } catch (error) {
        console.log('Error: getAvailableRooms function', error.message);
        return error;
    }
}

export const getAllAvailableRooms = async() => {
    try {
        const [rooms] = await db.query(
            `
            select r.room_number, t.type_name, t.capacity, r.price, r.description, r.image_url
            from Rooms r join RoomType t on r.room_type = t.type_id
            where r.status = 'available'
            `
        )
        if(rooms.length === 0) {
            return {
                status: 404,
                message: 'There is no available room now.'
            }
        }
        return {
            status: 200,
            data: rooms
        }
    } catch (error) {
        console.log('Error: getAllAvailableRooms function', error.message);
        return error;
    }
}