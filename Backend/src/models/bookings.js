import db from '../config/db.js'

export async function initBookingDetailsModel() {
    const createBookingDetailsTable = `
        create table if not exists BookingDetails (
            id int auto_increment primary key,
            booking_id int not null,
            room_id int not null,
            price decimal(10, 2),
            nights int,
            foreign key (booking_id) references Bookings(booking_id)
                on delete cascade
                on update cascade,
            foreign key (room_id) references Rooms(room_id)
                on delete cascade
                on update cascade
        )
    `;

    await db.query(createBookingDetailsTable);
    console.log('BookingDetails created.')
}

export async function initBookingsModel() {
    const createBookingsModel = `
        create table if not exists Bookings (
            booking_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            total_price DECIMAL(10,2),
            status ENUM('booked', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'booked',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Account(user_id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            CONSTRAINT chk_dates CHECK (check_out > check_in)
        )
    `;

    await db.query(createBookingsModel);
    console.log('Bookings table created.');
}