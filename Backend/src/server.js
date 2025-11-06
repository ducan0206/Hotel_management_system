import express from 'express'
import db from '../src/config/db.js'
import adminRoute from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import generalRoute from './routes/generalRoute.js'
import {initRoomsModel, initRoomTypeModel} from '../src/models/rooms.js'
import {initPaymentModel} from '../src/models/payments.js'
import {initBookingsModel, initBookingDetailsModel} from '../src/models/bookings.js'
import {initAccountsModel} from './models/account.js'
import {initServiceModel, initServiceOrderedModel} from '../src/models/service.js'
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
app.use("/", generalRoute);

cloudinary.api.ping()
    .then(res => console.log('? Cloudinary connected:', res))
    .catch(err => console.error('? Cloudinary error:', err));

const startServer = async () => {
    try {
        await db.getConnection();

        await initAccountsModel();
        await initRoomTypeModel();
        await initRoomsModel();
        await initBookingsModel();
        await initBookingDetailsModel();
        await initPaymentModel();
        await initServiceModel();
        await initServiceOrderedModel();
       
        app.listen(5001, () => {
            console.log('Server start ...');
        })
    } catch (error) {
        console.error('Server start fail: ', error.message);
        process.exit(1);
    }
}

startServer();