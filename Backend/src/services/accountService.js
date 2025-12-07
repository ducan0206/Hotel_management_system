import db from '../config/db.js'
import bcrypt from 'bcrypt'

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
    
        // ========== VALIDATION FOR CUSTOMER REGISTRATION (Sơn - Date: 07/12/2025) ==========
        // Thứ tự kiểm tra: fullName -> phone -> username -> email -> password
        // Mỗi field được validate riêng để thông báo lỗi cụ thể cho người dùng
        
        if(role === 'customer') {
            // ========== 1. FULLNAME VALIDATION ==========
            // Kiểm tra fullName có tồn tại không
            if(!fullName) {
                return { status: 400, message: 'Full name is required.' };
            }
            // Kiểm tra fullName không chỉ là khoảng trắng
            if(!fullName.trim()) {
                return { status: 400, message: 'Full name cannot be empty or contain only whitespace.' };
            }

            // ========== 2. PHONE VALIDATION ==========
            // Kiểm tra phone có tồn tại không
            if(!phone) {
                return { status: 400, message: 'Phone number is required.' };
            }
            // Kiểm tra phone không chỉ là khoảng trắng
            if(!phone.trim()) {
                return { status: 400, message: 'Phone number cannot be empty or contain only whitespace.' };
            }
            // Kiểm tra phone chỉ chứa số từ 0-9
            if(!/^\d+$/.test(phone)) {
                return { status: 400, message: 'Phone number can only contain digits (0-9).' };
            }

            // ========== 3. USERNAME VALIDATION ==========
            // Kiểm tra username có tồn tại không
            if(!username) {
                return { status: 400, message: 'Username is required.' };
            }
            // Kiểm tra username không chỉ là khoảng trắng
            if(!username.trim()) {
                return { status: 400, message: 'Username cannot be empty or contain only whitespace.' };
            }
            // Kiểm tra username không được chứa khoảng trắng (đầu, giữa, cuối)
            if(/\s/.test(username)) {
                return { status: 400, message: 'Username cannot contain whitespace.' };
            }
            // Kiểm tra username phải có ít nhất 8 ký tự
            if(username.length < 8) {
                return { status: 400, message: 'Username must be at least 8 characters long.' };
            }
            // Kiểm tra username đã tồn tại trong database chưa
            const [existingUsername] = await db.query(
                `select * from Account where username = ?`,
                [username]
            );
            if(existingUsername.length !== 0) {
                return { status: 400, message: 'Username already exists. Please choose another username.' };
            }

            // ========== 4. EMAIL VALIDATION ==========
            // Kiểm tra email có tồn tại không
            if(!email) {
                return { status: 400, message: 'Email is required.' };
            }
            // Kiểm tra email không chỉ là khoảng trắng
            if(!email.trim()) {
                return { status: 400, message: 'Email cannot be empty or contain only whitespace.' };
            }
            // Kiểm tra email đúng format (example@gmail.com)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                return { status: 400, message: 'Invalid email format. Please use format: example@gmail.com' };
            }

            // ========== 5. PASSWORD VALIDATION ==========
            // Kiểm tra password có tồn tại không
            if(!password) {
                return { status: 400, message: 'Password is required.' };
            }
            // Kiểm tra password không chỉ là khoảng trắng
            if(!password.trim()) {
                return { status: 400, message: 'Password cannot be empty or contain only whitespace.' };
            }
            // Kiểm tra password phải có ít nhất 8 ký tự
            if(password.length < 8) {
                return { status: 400, message: 'Password must be at least 8 characters long.' };
            }
            // Kiểm tra password không được chứa khoảng trắng (đầu, giữa, cuối)
            if(/\s/.test(password)) {
                return { status: 400, message: 'Password cannot contain whitespace.' };
            }
            // Kiểm tra password phải có ít nhất 1 chữ cái in hoa (A-Z)
            if(!/[A-Z]/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 uppercase letter.' };
            }
            // Kiểm tra password phải có ít nhất 1 chữ số (0-9)
            if(!/\d/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 digit.' };
            }
            // Kiểm tra password phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
            if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return { status: 400, message: 'Password must contain at least 1 special character.' };
            }
        }
        // ========== END VALIDATION ==========

        // Check if email already exists
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