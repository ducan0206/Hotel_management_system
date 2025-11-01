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

export const addNewPayment = async(id) => {
    try {
        const [existingPayment] = await db.query(`select * from Payments where payment_id = ?`, [id]);
        if(existingPayment.length === 0) {
            throw new Error(`Payment with id ${id} not found.`)
        }
        await db.query(
            `
            delete from Payments
            where payment_id = ?
            `, [id]
        )
        return {message: `Payment with id ${id} has been deleted.`}
    } catch (error) {
        console.log('Error: fetchAllPayments function', error);
        return error;
    }
}