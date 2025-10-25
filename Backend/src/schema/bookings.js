import db from '../config/db.js'

export async function initBookingsModel() {
    const createBookingsModel = `
        create table if not exists bookings (
            booking_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            room_id INT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            total_price DECIMAL(10,2),
            status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE,
            FOREIGN KEY (room_id) REFERENCES rooms(room_id)
                ON DELETE CASCADE,
            CONSTRAINT chk_dates CHECK (check_out > check_in)
        )
    `;

    await db.query(createBookingsModel);
    console.log('Bookings table created.');
}