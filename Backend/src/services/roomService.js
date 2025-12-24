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
        if(rows.length === 0) {
            return {
                status: 404,
                message: 'No rooms found.'
            }
        }
        return {
            status: 200,
            data: rows
        }
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

export const addRoom = async ({ room_number, room_type, price, status, description, image_url, area, standard, floor, services }) => {
    try {
        const [type] = await db.query(
            'select type_id from RoomType where type_id = ?',
            [room_type]
        );

        if (type.length === 0) {
            throw new Error(`Room Type ID ${room_type} not existed.`);
        }

        let servicesJson = null;

        if (services) {
            let serviceData = services;
            if (typeof services === 'string') {
                try {
                    serviceData = JSON.parse(services);
                } catch {
                    throw new Error('Services must be valid JSON.');
                }
            }
            servicesJson = JSON.stringify(serviceData);
        }

        const [result] = await db.query(
            `
            INSERT INTO Rooms
            (room_number, room_type, price, status, description, image_url, area, standard, floor, services)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                room_number,
                room_type, 
                price,
                status,
                description,
                image_url,
                area,
                standard,
                floor,
                servicesJson
            ]
        );

        const [rows] = await db.query(
            `
            SELECT r.*, t.type_name, t.capacity
            FROM Rooms r
            JOIN RoomType t ON r.room_type = t.type_id
            WHERE r.room_id = ?
            `,
            [result.insertId]
        );

        const newRoom = rows[0];
        newRoom.services = newRoom.services ? JSON.parse(newRoom.services) : [];

        return {
            status: 201,
            data: newRoom
        };

    } catch (error) {
        console.error('Error: addRoom function', error.message);
        return {
            status: 400,
            message: error.message
        };
    }
};


export const updatingRoom = async (id, roomData) => {
    try {
        if (!roomData) {
            return {
                status: 400,
                message: "Request body is empty"
            };
        }

        const [rows] = await db.query(
            "SELECT * FROM Rooms WHERE room_id = ?",
            [id]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: `Room with id ${id} not found`
            };
        }

        const old = rows[0];

        const updated = {
            room_number: roomData.room_number ?? old.room_number,
            room_type: roomData.room_type ?? old.room_type,
            price: roomData.price ?? old.price,
            status: roomData.status ?? old.status,
            description: roomData.description ?? old.description,
            image_url: roomData.image_url ?? old.image_url,
            area: roomData.area ?? old.area,
            standard: roomData.standard ?? old.standard,
            floor: roomData.floor ?? old.floor,
            services: roomData.services
                ? JSON.stringify(roomData.services)
                : old.services
        };

        await db.query(
            `
            UPDATE Rooms
            SET room_number = ?,
                room_type = ?,
                price = ?,
                status = ?,
                description = ?,
                image_url = ?,
                area = ?,
                standard = ?,
                floor = ?,
                services = ?
            WHERE room_id = ?
            `,
            [
                updated.room_number,
                updated.room_type,
                updated.price,
                updated.status,
                updated.description,
                updated.image_url,
                updated.area,
                updated.standard,
                updated.floor,
                updated.services,
                id
            ]
        );

        const [result] = await db.query(
            `
            SELECT r.*, t.type_name, t.capacity
            FROM Rooms r
            JOIN RoomType t ON r.room_type = t.type_id
            WHERE r.room_id = ?
            `,
            [id]
        );

        return {
            status: 200,
            data: result[0]
        };
    } catch (error) {
        console.log("Error updatingRoom:", error.message);
        return {
            status: 500,
            message: error.message
        };
    }
};

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
        return {
            status: 200,
            message: `Room with id ${id} has been deleted.`
        }
    } catch (error) {
        console.log('Error: deletingRoom function', error.message);
        return error;
    }
}

export const fetchAllRoomTypes = async() => {
    try {
        const [rows] = await db.query("select * from RoomType");
        if(rows.length === 0) {
            return {
                status: 404,
                message: 'No room types found.'
            }
        }
        return {
            status: 200,
            data: rows
        };
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
        console.log(id);
        const [existingType] = await db.query("select * from RoomType where type_id = ?", [id]);
        if(existingType.length === 0) {
            return {
                status: 404,
                message: `Room type with id ${id} not found.`
            }
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
        return {
            status: 200,
            data: newType[0]
        }
    } catch (error) {
        console.log('Error: updatingRoomType function', error.message);
        return error;
    }
}

export const deletingRoomType = async(id) => {
    try {
        const [existingType] = await db.query("select * from RoomType where type_id = ?", [id]);
        if(existingType.length === 0) {
            return {
                status: 404,
                message: `Room type with id ${id} not found.`
            }
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
        return {
            status: 200,
            message: `Room type with id ${id} has been deleted.`
        };
    } catch (error) {
        console.log('Error: deletingRoomType function', error.message);
        return error;
    }
}

// customer
export const getAvailableRooms = async(data) => {
    try {   
        const {check_in, check_out, capacity} = data;
        if(!check_in || !check_out) {
            return {
                status: 400,
                message: 'Both check_in and check_out are required'
            }
        }


        // Chuy?n ??i các chu?i ngày tháng sang ??i t??ng Date ?? so sánh
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        // Ki?m tra xem check_in có l?n h?n ho?c b?ng check_out không.
        // Logic: Check-out ph?i sau Check-in
        if (checkInDate >= checkOutDate) {
            return {
                status: 400,
                message: 'Check-out date must be after check-in date.'
            }
        }
        
        // OPTIONAL: Ki?m tra ngày check-in có ph?i là quá kh? không
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ??t gi? v? 0 ?? so sánh ch? ngày
        if (checkInDate < today) {
            return {
                status: 400,
                message: 'Check-in date cannot be in the past.'
            }
        }


        const [rooms] = await db.query(
            `
            select r.*, t.type_name, t.capacity
            from Rooms r join RoomType t on r.room_type = t.type_id
            where r.room_id not in (
                select d.room_id
                from Bookings b join BookingDetails d on b.booking_id = d.booking_id
                where b.status not in ('cancelled', 'checked_out') and (b.check_in < ? and b.check_out > ?) and t.capacity >= ?
            ) and r.status = 'available'
            `, [check_in, check_out, parseInt(capacity)]
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
            select r.room_id, r.room_number, t.type_name, t.capacity, r.price, r.description, r.image_url, r.area, r.standard, r.floor, r.services
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