import db from '../config/db.js'

export const fetchAllPayments = async() => {
    try {
        const [payments] = await db.query(
            `
            select * from Payments
            `
        )
        return payments;
    } catch (error) {
        console.log('Error: fetchAllPayments function', error);
        return error;
    }
}

export const fetchPaymentByID = async(id) => {
    try {
        const [existingPayment] = await db.query(`select * from Payments where payment_id = ?`, [id]);
        if(existingPayment.length === 0) {
            throw new Error(`Payment with id ${id} not found.`)
        }
        return existingPayment[0];
    } catch (error) {
        console.log('Error: fetchAllPayments function', error);
        return error;
    }
}

export const addNewPayment = async(info) => {
    try {
        const {booking_id, amount, payment_method} = info;
        const [existingBooking] = await db.query(
            `
            select * from Bookings where booking_id = ?
            `, [booking_id]
        )
        if(existingBooking.length === 0) {
            throw new Error(`Booking with id ${id} not found.`);
        }
        await db.query(
            `
            insert into Payments (booking_id, amount, payment_method, created_at)
            values (?, ?, ?, NOW())
            `, [booking_id, amount, payment_method]
        )
        return {message: `Payment related to booking id ${booking_id} has been added.`}
    } catch (error) {
        console.log('Error: fetchAllPayments function', error);
        return error;
    }
}