import db from '../config/db.js'

export async function initRoomTypeModel() {
    const createRoomTypeTable = `
        create table if not exists RoomType (
            type_id int auto_increment primary key,
            type_name varchar(255),
            capacity int
        )
    `;

    await db.query(createRoomTypeTable);
    console.log('Room type table create.')
}

export async function initRoomsModel() {
    const createRoomTable = `
        create table IF NOT EXISTS Rooms (
            room_id int auto_increment primary key,
            room_type int,
            room_number VARCHAR(10) NOT NULL UNIQUE,
            price DECIMAL(10,2) NOT NULL,
            status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
            description TEXT,
            image_url VARCHAR(255),  -- store file path or URL
            foreign key (room_type) references RoomType(type_id)
                on update cascade
                on delete set null
    )
    `;

    await db.query(createRoomTable);
    console.log('Rooms table created.')
}