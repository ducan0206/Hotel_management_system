import {fetchAllRooms, fetchRoomByID, addRoom, updatingRoom, deletingRoom, fetchAllRoomTypes, addNewRoomType, updatingRoomType, deletingRoomType} from '../services/roomService.js'
import {fetchAllServices, addNewService, updatingService, deletingService, fetchAllServiceOrders} from '../services/additionalService.js'
import {fetchAllBookings, fetchBookingByID, updatingBooking, addNewBooking, deletingBooking} from '../services/bookingService.js'
import {fetchAllCustomers, getInfo, deletingCustomer} from '../helper/customer.js'

// room management
export const getAllRooms = async(request, response) => {
    try {
        const rooms = await fetchAllRooms();
        response.status(200).json(rooms);
    } catch (error) {
        console.log("getAllRooms function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getRoomByID = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const room = await fetchRoomByID(id);
        response.status(200).json(room);
    } catch (error) {
        console.log("getRoomByID function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const addNewRoom = async(request, response) => {
    try {
        // Cloudinary automatically provides a secure URL
        const imageUrl = request.file ? request.file.path : null;

        const newRoom = await addRoom({
            ...request.body,
            img_url: imageUrl
        });
        if(!newRoom) {
            return response.status(500).json({message: "System error"});
        }
        response.status(201).json(newRoom);
    } catch (error) {
        console.log("addNewRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateRoom = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const updatedRoom = await updatingRoom(id, request.body);
        response.status(200).json(updatedRoom);
    } catch (error) {
        console.log("updateRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteRoom = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const result = await deletingRoom(id);
        if(result.status === 404) 
            response.status(404).json({message: result.message});
        response.status(200).json(result);
    } catch (error) {
        console.log("deleteRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getAllRoomTypes = async(request, response) => {
    try {
        const result = await fetchAllRoomTypes();
        response.status(200).json(result);
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const createNewRoomType = async(request, response) => {
    try {
        const result = await addNewRoomType(request.body);
        if(!result) {
            return response.status(500).json({message: "System error"});
        }
        response.status(201).json(result);
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateRoomType = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const updated = await updatingRoomType(id, request.body);
        response.status(200).json(updated);
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteRoomType = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const result = await deletingRoomType(id);
        if(result.status === 404) 
            response.status(404).json({message: result.message});
        response.status(200).json(result);
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

// service management
export const getAllServices = async(request, response) => {
    try {
        const services = await fetchAllServices();
        response.status(200).json(services);
    } catch (error) {
        console.log("deleteService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const createNewService = async(request, response) => {
    try {
        const newService = await addNewService(request.body);
        if(!newService) {
            return response.status(500).json({message: "System error"});
        }
        response.status(201).json(newService);
    } catch (error) {
        console.log("deleteService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateService = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const updated = await updatingService(id, request.body);
        response.status(200).json(updated); 
    } catch (error) {
        console.log("deleteService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteService = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const result = await deletingService(id);
        if(result.status === 404) 
            response.status(404).json({message: result.message});
        response.status(200).json(result);
    } catch (error) {
        console.log("deleteService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getAllServiceOrder = async(request, response) => {
    try {
        const services = await fetchAllServiceOrders();
        response.status(200).json(services);
    } catch (error) {
        console.log("deleteService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

// booking management
export const getAllBookings = async(request, response) => {
    try {
        const bookings = await fetchAllBookings();
        response.status(200).json(bookings);
    } catch (error) {
        console.log("getAllBookings function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getBookingByID = async(request, response) => {
    try {
        const id = parseInt(request.params.id);
        const booking = await fetchBookingByID(id);
        response.status(200).json(booking);
    } catch (error) {
        console.log("getBookingByID function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateBooking = async(request, response) => {
    try {
        const id = parseInt(request.params.id);
        const updated = await updatingBooking(id, request.body);
        response.status(200).json(updated);
    } catch (error) {
        console.log("updateBooking function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const createNewBooking = async(request, response) => {
    try {
        const newBooking = await addNewBooking(request.body);
        if(!newBooking) {
            return response.status(500).json({message: "System error"});
        }
        response.status(200).json(newBooking);
    } catch (error) {
        console.log("createNewBooking function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteBooking = async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        const result = await deletingBooking(id);

        if (result.status === 404) {
            return response.status(404).json({ message: result.message });
        }

        return response.status(200).json(result);
    } catch (error) {
        console.log("deleteBooking function error: ", error.message);
        return response.status(500).json({ message: "System error" });
    }
};

// payment management
export const getAllPayments = async (request, response) => {
    try {
        const payments = await fetchAllPayments();
        response.status(200).json(payments);
    } catch (error) {
        console.log('getAllPayments function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const getAllPaymentsById = async (request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const payment = await fetchPaymentByID();
        response.status(200).json(payment);
    } catch (error) {
        console.log('getAllPaymentsById function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const updatePayment = async (request, response) => {
    try {

    } catch (error) {
        console.log('updatePayment function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const createPayment = async (request, response) => {
    try {

    } catch (error) {
        console.log('createPayment function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

// customer management
export const getAllCustomers = async (request, response) => {
    try {
        const customers = await fetchAllCustomers();
        response.status(200).json(customers);
    } catch (error) {
        console.log('getAllCustomers function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const getCustomerInfo = async (request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        const info = await getInfo(id);
        response.status(200).json(info);
    } catch (error) {
        console.log('getCustomerInfo function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const updateCustomerInfo = async (request, response) => {
    try {

    } catch (error) {
        console.log('updateCustomerInfo function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const deleteCustomer = async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        const result = await deletingCustomer(id);
        if(result.status === 404) 
            response.status(404).json({message: result.message});
        response.status(200).json(result);
    } catch (error) {
        console.log('deleteCustomer function error: ', error);
        response.status(500).json({message: "System error"})
    }
}
