import db from '../config/db.js'

export const fetchAllCustomers = async() => {
    try {
        const [customers] = await db.query(
            `
            select a.user_id, c.KH_id, a.full_name, a.phone, a.id_card, a.date_of_birth, a.gender, a.address, a.email, a.username, a.created_at, count(b.booking_id) as total_booking, coalesce((b.total_price), 0) as total_spent
            from Account a join Customers c on a.user_id = c.account_id
                           left join Bookings b on a.user_id = b.user_id
            where a.role = 'customer'
            group by c.KH_id, a.full_name, a.phone, a.email, a.username, a.created_at;
            `
        )
        if (customers.length === 0) {
            return {
                status: 404,
                message: "Not found"
            }
        }
        return {
            status: 200,
            data: customers
        }
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

// how can fix with general cases: changes personal info, password, ...
export const updatingCustomerInfo = async(id, infoData) => {
    try {
        console.log(id);
        console.log(infoData);
        const [existingCustomer] = await db.query(
            `
            select user_id, full_name, phone, email, created_at from Account 
            where user_id = ? and role = 'customer'
            `, [id]
        )
        if(existingCustomer.length === 0) {
            throw new Error(`Customer with id ${id} not found.`);
        }
        const {full_name, phone, email, address, date_of_birth, gender, id_card} = infoData;
        await db.query(
            `
            update Account
                set full_name = ?,
                    phone = ?,
                    email = ?,
                    address = ?,
                    date_of_birth = ?,
                    gender = ?,
                    id_card = ?
            where user_id = ?
            `, [full_name, phone, email, address, date_of_birth, gender, id_card, id]
        )
        return {
            status: 200,
            message: `The information of customer with id ${id} has been updated.`
        }
    } catch (error) {
        console.log('Error: updatingCustomerInfo function', error.message);
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