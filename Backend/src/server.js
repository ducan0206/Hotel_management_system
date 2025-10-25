import express from 'express'
import db from '../src/config/db.js'
import {initRoomsModel} from '../src/schema/rooms.js'
import {initPaymentModel} from '../src/schema/payments.js'
import {initBookingsModel} from '../src/schema/bookings.js'
import {initUsersModel} from '../src/schema/users.js'

const app = express();

const startServer = async () => {
    try {
        await db.getConnection();
        await initRoomsModel();
        await initUsersModel();
        await initBookingsModel();
        await initPaymentModel();
        app.listen(5001, () => {
            console.log('Server start ...');
        })
    } catch (error) {
        console.error('Server start fail: ', error.message);
        process.exit(1);
    }
}

startServer();