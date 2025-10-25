import db from '../config/db.js'

export async function initRoomsModel() {
    const createRoomTable = `
        create table rooms (
        room_id int auto_increment primary key,
        room_number VARCHAR(10) NOT NULL UNIQUE,
        room_type varchar(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
        description TEXT,
        image_url VARCHAR(255)  -- store file path or URL
    )
    `;

    await db.query(createRoomTable);
    console.log('Room table created.')
}