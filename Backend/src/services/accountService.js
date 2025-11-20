import db from '../config/db.js'
import bcrypt from 'bcrypt'

export const createNewAccount = async(userData) => {
    try {
        const {username, password, fullName, phone, email} = userData;
        const [existingUser] = await db.query(
            `
            select * from Account where email = ?
            `, [email]
        )
        if(existingUser.length !== 0) {
            return { status: 400, message: 'Email already existed. Please use another email.'}
        }
        const hashedPass = await bcrypt.hash(password, 10); // 10 salt rounds
        const [result] = await db.query(
            `
            insert into Account (username, password_hash, full_name, phone, email, role, created_at) 
            values (?, ?, ?, ?, ?, ?, NOW())
            `, [username, hashedPass, fullName, phone, email, "customer"]
        )
        const [newUser] = await db.query(
            `
            select user_id, username, full_name, phone, email, role, created_at from Account where user_id = ?
            `, [result.insertId]
        )
        return {
            status: 201,
            data: newUser[0]
        }
    } catch (error) {
        console.log('Error: createNewAccount function', error.message);
        return {
            status: 500,
            message: 'System error'
        };
    }
}

export const getAccountById = async(id) => {
    try {
        const [existingAccount] = await db.query(
            `
            select * from Account where user_id = ?
            `, [id]
        )
        if(existingAccount.length === 0) {
            return {
                status: 404,
                message: `User with id ${id} not found.`
            }
        }
        return {
            status: 200,
            data: existingAccount[0]
        }
    } catch (error) {
        console.log('Error: getAccountById function', error.message);
        return error;
    }
}

// update all info except password
export const updatingAccount = async(id, accountData) => {
    try {
        const [existingAccount] = await db.query(
            `
            select * from Account where user_id = ?
            `, [id]
        )
        if(existingAccount.length === 0) {
            return {
                status: 404,
                message: `User with id ${id} not found.`
            }
        }
        const old = existingAccount[0];
        const updatedInfo = {
            full_name: accountData.full_name ?? old.full_name,
            phone: accountData.phone ?? old.phone
        }
        await db.query(
            `
            update Account
            set full_name = ?, phone = ?
            where user_id = ?
            `, [updatedInfo.full_name, updatedInfo.phone, id]
        )
        const [updated] = await db.query(
            `select * from Account where user_id = ?`, [id]
        )
        return {
            status: 200,
            data: updated[0]
        }
    } catch (error) {
        console.log('Error: updatingAccount function');
        return error;
    }
}