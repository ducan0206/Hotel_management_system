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
            throw new Error(`Booking with id ${booking_id} not found.`);
        }
        const [result] = await db.query(
            `
            insert into Payments (booking_id, amount, payment_method, created_at)
            values (?, ?, ?, NOW())
            `, [booking_id, amount, payment_method]
        )
        const [newPayment] = await db.query('select * from Payments where payment_id = ?', [result.insertId]);
        return newPayment[0];
    } catch (error) {
        console.log('Error: fetchAllPayments function', error);
        return error;
    }
}

export const getPaymentByBookingId = async(booking_id) => {
    try {
        const [existingBooking] = await db.query(
            `
            select * from Bookings 
            where booking_id = ?
            `, [booking_id]
        )
        if(existingBooking.length === 0) {
            return {
                status: 404,
                message: `Booking with id ${id} not found.`
            }
        }
        const [payment] = await db.query(
            `
            select method, amount
            from Payments where booking_id = ?
            `, [booking_id]
        )
        return {
            status: 200,
            data: payment[0]
        }
    } catch (error) {
        console.log('Error: getPayment function', error.message);
        return error;
    }
}