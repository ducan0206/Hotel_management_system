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
        const [existingId] = await db.query("select * from Account where user_id = ?", [id]);
        if(existingId.length === 0) {
            return {
                status: 404,
                message: `Account with id ${id} not found.`
            }
        }
        const [bookings] = await db.query(
            `
            select b.*, a.full_name, a.email, a.phone
            from Bookings b join Account a on b.user_id = a.user_id
            where a.user_id = ?
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

const getServicesDetailByName = async(services) => {
    if(!services || services.length === 0) {
        return [];
    }
    const placeholders = services.map(() => '?').join(', ');
    const [rows] = await db.query(
        `
        SELECT service_id, price 
        FROM Services
        WHERE service_name IN (?)
        `, [services]
    );
    return rows;
}

export const addingBooking = async (bookingData) => {
    const { user_id, check_in, check_out, room_id, room_status, room_price, services } = bookingData;

    // --- VALIDATE NGÀY ---
    const checkIn = new Date(check_in);
    const checkOut = new Date(check_out);

    if (checkOut <= checkIn) {
        throw new Error("Check out date must be after check in date.");
    }

    const nights = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 3600 * 24));
    const roomPrice = nights * room_price;

    let totalServicePrice = 0;
    let totalBookingPrice = roomPrice;

    try {
        // --- T?O BOOKING ---
        const [newBooking] = await db.query(
            `
            INSERT INTO Bookings (
                user_id, check_in, check_out, status, payment_status, created_at, updated_at
            ) VALUES (?, ?, ?, 'booked', 'not paid', NOW(), NOW())
            `,
            [user_id, check_in, check_out]
        );

        const booking_id = newBooking.insertId;

        // --- T?O BOOKING DETAIL ---
        await db.query(
            `
            INSERT INTO BookingDetails (booking_id, room_id, price, nights)
            VALUES (?, ?, ?, ?)
            `,
            [booking_id, room_id, room_price, nights]
        );

        // --- D?CH V? (N?U CÓ) ---
        if (Array.isArray(services) && services.length > 0) {
            const serviceRows = await getServicesDetailByName(services);

            const serviceOrderPromises = serviceRows.map(srv => {
                totalServicePrice += parseFloat(srv.price);

                return db.query(
                    `
                    INSERT INTO ServiceOrdered 
                    (booking_id, service_id, total_price, status, created_at, quantity)
                    VALUES (?, ?, ?, 'pending', NOW(), 1)
                    `,
                    [booking_id, srv.service_id, srv.price]
                );
            });

            await Promise.all(serviceOrderPromises);
        }

        // --- C?P NH?T T?NG TI?N ---
        totalBookingPrice += totalServicePrice;

        await db.query(
            `
            UPDATE Bookings
            SET total_price = ?
            WHERE booking_id = ?
            `,
            [totalBookingPrice, booking_id]
        );

        // --- L?Y THÔNG TIN BOOKING ===
        const [bookingInfo] = await db.query(
            `
            SELECT 
                b.booking_id, a.user_id, a.full_name, a.phone, a.email, 
                t.type_name, r.room_number, r.image_url,
                d.price AS room_price_per_night, d.nights,
                b.check_in, b.check_out, b.payment_status, b.total_price
            FROM Bookings b 
            JOIN BookingDetails d ON d.booking_id = b.booking_id
            JOIN Account a ON a.user_id = b.user_id
            JOIN Rooms r ON r.room_id = d.room_id
            JOIN RoomType t ON t.type_id = r.room_type
            WHERE b.booking_id = ?
            `,
            [booking_id]
        );

        const [servicesOrdered] = await db.query(
            `
            SELECT s.service_name, o.total_price AS service_cost, o.quantity
            FROM ServiceOrdered o
            JOIN Services s ON s.service_id = o.service_id
            WHERE o.booking_id = ?
            `,
            [booking_id]
        );

        return {
            status: 200,
            bookingInfo: bookingInfo[0],
            serviceInfo: servicesOrdered
        };

    } catch (error) {
        console.error("Error in addingBooking:", error);
        throw error;
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
            select a.full_name, a.phone, a.email, b.booking_id, r.room_number, t.type_name, r.image_url, d. nights, b.total_price, 
            from Bookings b join BookingDetails d on d.booking_id = b.booking_id
                            join Rooms r on r.room_id = d.room_id
                            join RoomType t on t.type_id = r.room_type
                            join Account a on a.user_id = b.user_id
                            left join ServiceOrdered o on o.booking_id = b.booking_id
                            left join Services s on s.service_id = o.service_id
            where b.booking_id = ? and user_id = ?
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