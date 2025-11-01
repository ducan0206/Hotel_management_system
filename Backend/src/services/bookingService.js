import db from '../config/db.js'

export const fetchAllBookings = async() => {
    try {
        const [bookings] = await db.query(
            ` 
            select b.*, a.full_name, a.email, a.phone
            from Bookings b join Account a on b.user_id = a.user_id
            `
        );
        return bookings;
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
            throw new Error(`Account with id ${id} not found.`);
        }
        const [bookings] = await db.query(
            `
            select b.*, a.full_name, a.email, a.phone
            from Bookings b join Account a on b.user_id = a.user_id
            where a.user_id = ?
            `, [id]
        )
        return bookings;
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
        const [existingId] = await db.query("select * from Bookings where booking_id = ?", [id]);
        if(existingId.length === 0) {
            return { status: 404, message: `Booking with ID ${id} not found.` };
        }
        await db.query(
            `
            delete from Bookings
            where booking_id = ?
            `, [id]
        )
        return {message: `Booking with id ${id} has been deleted.`};
    } catch (error) {
        console.log('Error: deletingBooking function', error);
        return error;
    }
}