import db from '../config/db.js'

export async function initUsersModel() {
    const createUsersModel = `
        create table if not exists users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL, -- crypto 
            full_name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            role ENUM('admin', 'customer') DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await db.query(createUsersModel);
    console.log('Users table created.')
}