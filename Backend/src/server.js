import express from 'express'
import db from '../src/config/db.js'
import adminRoute from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import {initRoomsModel, initRoomTypeModel} from '../src/models/rooms.js'
import {initPaymentModel} from '../src/models/payments.js'
import {initBookingsModel} from '../src/models/bookings.js'
import {initUsersModel} from '../src/models/users.js'
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

        await initRoomTypeModel();
        await initRoomsModel();
       
        app.listen(5001, () => {
            console.log('Server start ...');
        })
    } catch (error) {
        console.error('Server start fail: ', error.message);
        process.exit(1);
    }
}

startServer();