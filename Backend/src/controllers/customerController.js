import {fetchAllBookings, fetchBookingByID} from '../services/bookingService.js'

export const getAllBooking = async(request, response) => {
    try {
        const bookings = await fetchAllBookings();
        response.status(200).json(bookings);
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const getBookingByID = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10)
        const booking = await fetchBookingByID(id);
        response.status(200).json(booking);
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}

export const addNewBooking = async(request, response) => {
    try {
        
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
        
    } catch (error) {
        console.log('Error: getAllBooking funtion', error.message);
        response.status(500).json({message: "System error"})
    }
}