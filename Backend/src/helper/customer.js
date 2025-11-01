import db from '../config/db.js'

export const fetchAllCustomers = async() => {
    try {
        const customers = await db.query(
            `
            select user_id, full_name, phone, email, created_at from Account 
            where role = 'customer';
            `
        )
        return customers;
    } catch (error) {
        console.log('Error: fetchAllCustomers error', error.message);
        return error;
    }
}

export const getInfo = async(id) => {
    try {
        const [existingCustomer] = await db.query(
            `
            select user_id, full_name, phone, email, created_at from Account 
            where user_id = ? and role = 'customer'
            `, [id]
        )
        if(existingCustomer.length === 0) {
            throw new Error(`Customer with id ${id} not found.`);
        }
        return existingCustomer[0];
    } catch (error) {
        console.log('Error: fetchAllCustomers error', error.message);
        return error;
    }
}

export const deletingCustomer = async(id) => {
    try {
        const [existingCustomer] = await db.query(
            `
            select * from Account 
            where user_id = ? and role = 'customer'
            `, [id]
        )
        if(existingCustomer.length === 0) {
            throw new Error(`Customer with id ${id} not found.`);
        }
        await db.query(
            `
            delete from Account
            where user_id = ?
            `, [id]
        )
        return {message: `Customer with id ${id} has been deleted.`}
    } catch (error) {
        console.log('Error: fetchAllCustomers error', error.message);
        return error;
    }
}