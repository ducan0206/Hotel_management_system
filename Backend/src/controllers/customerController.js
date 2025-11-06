import {fetchBookingByID, addingBooking, getCustomerBooking, deletingBooking} from '../services/bookingService.js'
import {createNewAccount, getAccountById, updatingAccount} from '../services/accountService.js'
import {getAvailableRooms} from '../services/roomService.js'
import {getPaymentByBookingId} from '../services/paymentService.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '../config/db.js'

dotenv.config();

export const createAccount = async(request, response) => {
    try {
        const newAccount = await createNewAccount(request.body);
        if(newAccount.status === 400) {
            response.status(400).json(newAccount.message)
        }
        response.status(201).json(newAccount.data);
    } catch (error) {
        console.log('Error: createAccount function', error.message);
        response.status(500).json({message: 'System error'})
    }
}

export const loginAccount = async(request, response) => {
    try {
        const {username, password} = request.body;
        if(!username || !password) {
            return response.status(400).json({message: 'Username and password are required.'});
        }
        const [rows] = await db.query(
            `
            select * from Account where username = ?
            `, [username]
        )
        if(rows.length === 0) {
            return response.status(404).json({message: 'Account not found.'});
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return response.status(401).json({message: "Invalid credentials."})
        }
        const token = jwt.sign(
            {user_id: user.user_id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "2h"}
        )
        response.status(200).json(
            {
                message: 'Login sucessful',
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        )
    } catch (error) {
        console.log('Error: loginAccount error', error.message);
        response.status(500).json({message: 'System error'})
    }
}

export const updateAccount = async(request, response) => {
    try {
        const id = Number(request.params.id);
        const updated = await updatingAccount(id, request.body);
        if(updated.status === 404) {
            response.status(404).json({message: updated.message});
        }
        response.status(200).json(updated.data);
    } catch (error) {
        console.log('Error: updateAccount function', error.message);
        response.status(500).json({message: 'System error'})
    }
}

export const viewAccount = async(request, response) => {
    try {
        const id = Number(request.params.id);
        const account = await getAccountById(id);
        if(account.status === 404) {
            response.status(404).json({message: account.message});
        }
        response.status(200).json(account.data);
    } catch (error) {
        console.log('Error: viewAccount function', error.message);
        response.status(500).json({message: 'System error'})
    }
}

// get booking by customer id
export const getAllBooking = async(request, response) => {
    try {
        const id = Number(request.params.cus_id);
        const booking = await fetchBookingByID(id);
        if(booking.status === 404) {
            response.status(404).json(booking.message);
        }
        response.status(200).json(booking.data);
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

// get booking by customer id and booking id
export const getBookingByID = async(request, response) => {
    try {
        const cus_id = parseInt(request.params.cus_id, 10);
        const booking_id = parseInt(request.params.id, 10);
        const booking = await getCustomerBooking(cus_id, booking_id);
        if(booking.status === 404) {
            response.status(404).json(booking.message);
        }
        response.status(200).json(booking);
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const addNewBooking = async(request, response) => {
    try {
        const newBooking = await addingBooking(request.body);
        response.status(200).json(newBooking.data);
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const updateBooking = async(request, response) => {
    try {
        
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const deleteBooking = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const deleted = await deletingBooking(id);
        if(deleted.status !== 200) {
            response.status(deleted.status).json(deleted.message);
        }
        response.status(200).json({message: `Booking with id ${id} has been deleted.`})
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const getAllAvailableRooms = async(request, response) => {
    try {
        const rooms = await getAvailableRooms(request.body);
        if(rooms.status !== 200) {
            response.status(rooms.status).json(rooms.message);
        }
        response.status(200).json(rooms.data);
    } catch (error) {
        console.log('Error: getAllAvailableRooms function', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const getPayment = async(request, response) => {
    try {
        const booking_id = parseInt(request.params.booking_id);
        const payment = await getPaymentByBookingId(booking_id);
        if(payment.status !== 200) {
            response.status(payment.status).json(payment.message);
        }
        response.status(200).json(payment.data);
    } catch (error) {
        console.log('Error: getPayment function', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const createNewPayment = async(request, response) => {
    try {

    } catch (error) {
        console.log('Error: createNewPayment function', error.message);
        response.status(500).json({message: "System error"})
    }
}