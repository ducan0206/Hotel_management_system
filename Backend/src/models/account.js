import db from '../config/db.js'

export async function initAccountsModel() {
    const createAccountsModel = `
        create table if not exists Account (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL, -- crypto 
            full_name VARCHAR(100) not null,
            phone varchar(10),
            email VARCHAR(100) UNIQUE,
            role ENUM('admin', 'employee', 'customer') DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await db.query(createAccountsModel);
    console.log('Accounts table created.')
}

export async function initEmployeesModel() {
    const createEmployeesModel = `
        create table if not exists Employees (
            NV_id varchar(20) primary key,
            account_id int unique not null,
            foreign key (account_id) references Account(user_id) on delete cascade
        )
    `;

    await db.query(createEmployeesModel);
    console.log("Employees table created.")
}

export async function initCustomersModel() {
    const createCustomersModel = `
        create table if not exists Customers (
            KH_id varchar(20) primary key,
            account_id int unique not null,
            foreign key (account_id) references Account(user_id) on delete cascade
        )
    `;

    await db.query(createCustomersModel);
    console.log("Customers table created.")
}