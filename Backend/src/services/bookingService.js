import db from '../config/db.js'

// admin
export const fetchAllBookings = async() => {
    try {
        const [bookings] = await db.query(
            ` 
            select b.*, a.full_name, a.email, a.phone
            from Bookings b join Account a on b.user_id = a.user_id
            `
        );
        if(bookings.length === 0) {
            return {
                status: 404,
                message: 'Not found.'
            }
        }
        return {
            status: 200,
            data: bookings
        }
    } catch (error) {
        console.log('Error: fetchAllBookings function', error);
        return error;
    }
}

// filter by user id
export const fetchBookingByID = async(id) => {
    try {
        const [bookings] = await db.query(
            `
            select b.check_in, b.check_out, b.total_price, b.specialRequest,
                   a.full_name, a.phone, a.email, a.address, a.date_of_birth, a.id_card, a.gender, 
                   d.nights, d.adutls, d.children,
                   r.room_number, r.image_url,
                   t.type_name
            from Bookings b join Account a on b.user_id = a.user_id
                            join BookingDetails d on d.booking_id = b.booking_id
                            join Rooms r on r.room_id = d.room_id
                            join RoomType t on t.type_id = r.room_type
            where b.booking_id = ?
            `, [id]
        )
        return {
            status: 200, 
            data: bookings
        }
    } catch (error) {
        console.log('Error: fetchBookingByID function', error);
        return error;
    }
}

export const updatingBooking = async(id, bookingData) => {
    try {
        const [existing] = await db.query("select * from Bookings where booking_id = ?", [id]);
        if (existing.length === 0) {
            return { status: 404, message: `Booking with ID ${id} not found.` };
        }

        const old = existing[0];
        const updatedInfo = {
            check_in: bookingData.check_in ?? old.check_in,
            check_out: bookingData.check_out ?? old.check_out,
            total_price: bookingData.total_price ?? old.total_price,
            status: bookingData.status ?? old.status,
            payment_status: bookingData.payment_status ?? old.payment_status
        }

        await db.query(
            `
            update Bookings
            set check_in = ?, check_out = ?, total_price = ?, status = ?, payment_status = ?, updated_at = NOW()
            WHERE booking_id = ?
            `,
            [updatedInfo.check_in, updatedInfo.check_out, updatedInfo.total_price, updatedInfo.status, updatedInfo.payment_status, id]
        );

        const [updated] = await db.query("select * from Bookings where booking_id = ?", [id]);
        return updated[0];
    } catch (error) {
        console.log('Error: updatingBooking function', error);
        return error;
    }
}

export const addNewBooking = async (data) => {
    const { full_name, email, phone, check_in, check_out, total_price, status, payment_status } = data;

    const [existing] = await db.query("SELECT * FROM Account WHERE email = ?", [email]);

    let user_id;
    if (existing.length > 0) {
        user_id = existing[0].user_id;
    } else {
        const [result] = await db.query(`
        INSERT INTO Account (full_name, email, phone, password, role, created_at)
        VALUES (?, ?, ?, NULL, 'guest', NOW())
        `, [full_name, email, phone]);
        user_id = result.insertId;
    }

    const [bookingResult] = await db.query(`
        INSERT INTO Bookings (user_id, check_in, check_out, total_price, status, payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [user_id, check_in, check_out, total_price, status, payment_status]);

    const [newBooking] = await db.query("SELECT * FROM Bookings WHERE booking_id = ?", [bookingResult.insertId]);
    return newBooking[0];
};


export const deletingBooking = async(id) => {
    try {
        const [existingBooking] = await db.query("select * from Bookings where booking_id = ?", [id]);
        if(existingBooking.length === 0) {
            return { status: 404, message: `Booking with ID ${id} not found.` };
        }
        if(existingBooking[0].payment_status === 'paid') {
            return {
                status: 403,
                message: `Can not delete booking with id ${id} because it has already been paid.`
            }
        }
        await db.query(
            `
            delete from Bookings
            where booking_id = ?
            `, [id]
        )
        return {
            status: 200,
            message: `Booking with id ${id} has been deleted.`
        };
    } catch (error) {
        console.log('Error: deletingBooking function', error);
        return error;
    }
}



export const createBooking = async (data) => {
    const { userId, checkIn, checkOut, roomId, roomPrice, services, adults, children, specialRequest } = data;

    if (checkOut <= checkIn) {
        const error = new Error("Check-out date must be after check-in date.");
        error.statusCode = 400; 
        throw error;
    }
    const nights = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalRoomCost = nights * roomPrice;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [bookingResult] = await connection.query(
            `INSERT INTO Bookings 
            (user_id, check_in, check_out, status, payment_status, total_price, created_at, updated_at, specialRequest) 
            VALUES (?, ?, ?, 'booked', 'not paid', ?, NOW(), NOW(), ?)`,
            [userId, checkIn, checkOut, totalRoomCost, specialRequest]
        );

        const bookingId = bookingResult.insertId;

        await connection.query(
            `INSERT INTO BookingDetails (booking_id, room_id, price, nights, adutls, children)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [bookingId, roomId, roomPrice, nights, adults, children]
        );

        let totalServiceCost = 0;

        if (services.length > 0) {
            const servicePromises = services.map(service => {
                const srvPrice = parseFloat(service.price);
                totalServiceCost += srvPrice;

                return connection.query(
                    `INSERT INTO ServiceOrdered 
                    (booking_id, service_id, total_price, status, quantity, created_at)
                    VALUES (?, ?, ?, 'pending', 1, NOW())`,
                    [bookingId, service.service_id, srvPrice]
                );
            });

            await Promise.all(servicePromises);
        }

        const total_price = (totalRoomCost + totalServiceCost) * 1.1 + 25;

        if (totalServiceCost > 0) {
            await connection.query(
                `UPDATE Bookings SET total_price = ? WHERE booking_id = ?`,
                [total_price, bookingId]
            );
        }

        await connection.commit();
        return {
            status: 200,
            message: "Booking created successfully",
            id: bookingId
        };

    } catch (error) {
        // G?p l?i -> Rollback toàn b?
        await connection.rollback();
        throw error; // Ném l?i v? Controller x? lý
    } finally {
        // Tr? connection v? pool
        connection.release();
    }
};




export const getCustomerBooking = async(cus_id, booking_id) => {
    try {
        const [existingUser] = await db.query(
            `
            select * from Account where user_id = ? and role = 'customer'
            `, [cus_id]
        )
        if(existingUser.length === 0) {
            return {
                status: 404,
                message: `User with id ${id} not found.`
            }
        }
        const [existingBooking] = await db.query(
            `
            select * from Bookings where booking_id = ? and user_id = ?
            `, [booking_id, cus_id]
        )
        if(existingBooking.length === 0) {
            return {
                status: 404,
                message: `Booking with id ${id} not found.`
            }
        }
        const [booking] = await db.query(
            `
            select a.full_name, a.phone, a.email, b.booking_id, r.room_number, t.type_name, r.image_url, d. nights, b.total_price
            from Bookings b join BookingDetails d on d.booking_id = b.booking_id
                            join Rooms r on r.room_id = d.room_id
                            join RoomType t on t.type_id = r.room_type
                            join Account a on a.user_id = b.user_id
                            left join ServiceOrdered o on o.booking_id = b.booking_id
                            left join Services s on s.service_id = o.service_id
            where b.booking_id = ? and a.user_id = ?;
            `, [booking_id, cus_id]
        )
        return {
            status: 200,
            data: booking[0]
        }
    } catch (error) {
        console.log('Error: getCustomerBooking function', error.message);
        return error;
    }
}