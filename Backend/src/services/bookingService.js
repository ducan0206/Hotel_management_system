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

export const updatingBooking = async() => {
    try {

    } catch (error) {
        console.log('Error: updatingBooking function', error);
        return error;
    }
}

export const addNewBooking = async() => {
    try {

    } catch (error) {
        console.log('Error: addNewBooking function', error);
        return error;
    }
}

export const deletingBooking = async(id) => {
    try {
        cosnt [existingId] = await db.query("select * from Bookings where booking_id = ?", [id]);
        if(existingId.length === 0) {
            throw new Error(`Booking with id ${id} not found.`);
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