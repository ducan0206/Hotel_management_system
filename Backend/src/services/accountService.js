import db from '../config/db.js'
import bcrypt from 'bcrypt'

export async function fetchAllReceptions() {
    try {
        const [rows] = await db.query(`
            SELECT a.user_id, a.full_name, a.phone, a.email, DATE_FORMAT(a.created_at, '%d/%m/%Y') AS created_at
            FROM Account a
            JOIN Employees e ON a.user_id = e.account_id
            WHERE a.role = 'employee'
        `);

        if (rows.length === 0) {
            return {
                status: 404,
                message: 'No receptionists found.'
            };
        }

        return {
            status: 200,
            data: rows
        };
    } catch (error) {
        console.log('Error: fetchAllReceptions function', error.message);
        return {
            status: 500,
            message: 'System error'
        };
    }
}

export async function deleteReceptionByID(id) {
    try {
        const [existingAccount] = await db.query(
            `
            select * from Account where user_id = ? AND role = 'employee'
            `, [id]
        )
        if(existingAccount.length === 0) {
            return {
                status: 404,
                message: `Receptionist with id ${id} not found.`
            }
        }   
        await db.query(
            `
            delete from Account where user_id = ?   
            `, [id]
        )
        return {
            status: 204
        }
    } catch (error) {
        console.log('Error: deleteReceptionByID function', error.message);
        return {
            status: 500,
            message: 'System error'
        };
    }
}

async function generateEmployeeId() {
    const [rows] = await db.query(`
        SELECT NV_id FROM Employees ORDER BY CAST(SUBSTRING(NV_id, 4) AS UNSIGNED) DESC LIMIT 1
    `);

    if (rows.length === 0) return "NV_1";

    const lastNumber = parseInt(rows[0].NV_id.split("_")[1]);
    return `NV_${lastNumber + 1}`;
}

async function generateCustomerId() {
    const [rows] = await db.query(`
        SELECT KH_id FROM Customers ORDER BY CAST(SUBSTRING(KH_id, 4) AS UNSIGNED) DESC LIMIT 1
    `);

    if (rows.length === 0) return "KH_1";

    const lastNumber = parseInt(rows[0].KH_id.split("_")[1]);
    return `KH_${lastNumber + 1}`;
}


export const createNewAccount = async(userData) => {
    try {
        const {username, password, fullName, phone, email, role} = userData;
        
        if(role === 'customer') {
            if(!fullName) {
                return { status: 400, message: 'Full name is required.' };
            }
            if(!fullName.trim()) {
                return { status: 400, message: 'Full name cannot be empty or contain only whitespace.' };
            }

            if(!phone) {
                return { status: 400, message: 'Phone number is required.' };
            }
            if(!phone.trim()) {
                return { status: 400, message: 'Phone number cannot be empty or contain only whitespace.' };
            }
            if(!/^\d+$/.test(phone)) {
                return { status: 400, message: 'Phone number can only contain digits (0-9).' };
            }

            if(!username) {
                return { status: 400, message: 'Username is required.' };
            }
            if(!username.trim()) {
                return { status: 400, message: 'Username cannot be empty or contain only whitespace.' };
            }
            if(/\s/.test(username)) {
                return { status: 400, message: 'Username cannot contain whitespace.' };
            }
            if(username.length < 8) {
                return { status: 400, message: 'Username must be at least 8 characters long.' };
            }
            const [existingUsername] = await db.query(
                `select * from Account where username = ?`,
                [username]
            );
            if(existingUsername.length !== 0) {
                return { status: 400, message: 'Username already exists. Please choose another username.' };
            }

            if(!email) {
                return { status: 400, message: 'Email is required.' };
            }
            if(!email.trim()) {
                return { status: 400, message: 'Email cannot be empty or contain only whitespace.' };
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                return { status: 400, message: 'Invalid email format. Please use format: example@gmail.com' };
            }

            if(!password) {
                return { status: 400, message: 'Password is required.' };
            }
            if(!password.trim()) {
                return { status: 400, message: 'Password cannot be empty or contain only whitespace.' };
            }
            if(password.length < 8) {
                return { status: 400, message: 'Password must be at least 8 characters long.' };
            }
            if(/\s/.test(password)) {
                return { status: 400, message: 'Password cannot contain whitespace.' };
            }
            if(!/[A-Z]/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 uppercase letter.' };
            }
            if(!/\d/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 digit.' };
            }
            if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 special character.' };
            }
        }
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
            `, [username, hashedPass, fullName, phone, email, role]
        )


        const accountId = result.insertId;
        let generatedId = null;

        if(role === 'employee') {
            generatedId = await generateEmployeeId();
            await db.query(
                `
                insert into Employees (NV_id, account_id) values (?, ?)
                `, [generatedId, accountId]
            )
        }

        if(role === 'customer') {
            generatedId = await generateCustomerId();
            await db.query(
                `
                insert into Customers (KH_id, account_id) values (?, ?)
                `, [generatedId, accountId]
            )
        }

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