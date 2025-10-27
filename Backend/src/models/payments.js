import db from '../config/db.js'

export async function initPaymentModel() {
    const createPaymentModel = `
        create table if not exists payments (
            payment_id INT AUTO_INCREMENT PRIMARY KEY,
            booking_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            payment_method ENUM('credit_card', 'cash', 'paypal') NOT NULL,
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
                ON DELETE CASCADE
        )
    `;

    await db.query(createPaymentModel);
    console.log('Payments table created.')
}