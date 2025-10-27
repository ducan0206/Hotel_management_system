import db from '../config/db.js'

export const fetchBookings = async() => {
    try {
        const [bookings] = await db.query("select * from bookings");
        return bookings;
    } catch (error) {
        console.log('Error: ', error.message);
        return error;
    }
}

export const findBookingByID = async(id) => {
    try {
        const [result] = await db.query("select * from bookings where booking_id = ?", [id]);
        if(result.length === 0) {
            throw new Error(`Booking with ${id} not found.`);
        }
        return result[0];
    } catch (error) {
        console.log('Error: ', error.message);
        return error;
    }
}