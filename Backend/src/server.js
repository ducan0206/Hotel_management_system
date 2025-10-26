import express from 'express'
import db from '../src/config/db.js'
import adminRoute from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import {initRoomsModel} from '../src/schema/rooms.js'
import {initPaymentModel} from '../src/schema/payments.js'
import {initBookingsModel} from '../src/schema/bookings.js'
import {initUsersModel} from '../src/schema/users.js'
import cors from 'cors'
import cloudinary from '../src/config/cloudinary.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}))

app.use(express.json());

app.use("/admin", adminRoute);
app.use("/user", customerRoute);

cloudinary.api.ping()
    .then(res => console.log('? Cloudinary connected:', res))
    .catch(err => console.error('? Cloudinary error:', err));

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