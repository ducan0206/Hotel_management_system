import db from '../config/db.js'

export async function initServiceModel() {
    const createServiceTable = `
        create table if not exists Services (
            service_id int auto_increment primary key,
            service_name varchar(255),
            price decimal(10, 2) not null check(price >= 0), 
            description text,
            status enum('Available', 'Unavailable') default 'available',
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp on update current_timestamp
        )
    `;

    await db.query(createServiceTable);
    console.log('Service table created.')
}

export async function initServiceOrderedModel() {
    const createServiceOrderedTable = `
        create table if not exists ServiceOrdered (
            order_id int auto_increment primary key,
            booking_id int not null,
            service_id int not null,
            quantity int default 1,
            total_price decimal(10, 2),
            status enum('pending', 'completed', 'cancelled') default 'pending',
            created_at timestamp default current_timestamp,
            foreign key (booking_id) references Bookings(booking_id)
                on delete cascade
                on update cascade,
            foreign key (service_id) references Services(service_id)
                on delete cascade
                on update cascade
        )
    `

    await db.query(createServiceOrderedTable);
    console.log('Service ordered created.')
}