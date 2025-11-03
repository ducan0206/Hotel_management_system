import db from '../config/db.js'
import bcrypt from 'bcrypt'

export const createNewAccount = async(userData) => {
    try {
        const {user_name, password, full_name, phone, email} = userData;
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
            `, [user_name, hashedPass, full_name, phone, email, "customer"]
        )
        const [newUser] = await db.query(
            `
            select * from Account where user_id = ?
            `, [result.insertId]
        )
        return newUser[0];
    } catch (error) {
        console.log('Error: createNewAccount function', error.message);
        return error;
    }
}