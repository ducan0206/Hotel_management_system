import {fetchAllRooms, fetchRoomByID, addRoom, updatingRoom, deletingRoom, fetchAllRoomTypes, addNewRoomType, updatingRoomType, deletingRoomType} from '../services/roomService.js'
import {fetchAllServices, addNewService, updatingService, deletingService, fetchAllServiceOrders} from '../services/additionalService.js'
import {fetchAllBookings, fetchBookingByID, updatingBooking, addNewBooking, deletingBooking} from '../services/bookingService.js'
import {fetchAllPayments, fetchPaymentByID, addNewPayment} from '../services/paymentService.js'
import {fetchAllCustomers, getInfo, deletingCustomer, updatingCustomerInfo} from '../helper/customer.js'
import {createNewAccount, fetchAllReceptions, deleteReceptionByID} from '../services/accountService.js'
import db from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// admin login
export const adminLogin = async(request, response) => {
    try {
        const {username, password} = request.body;
        console.log(username, password)
        if(!username || !password) {
            return response.status(400).json({message: 'Username and password are required.'});
        }
        const [rows] = await db.query(
            `
            select * from Account where email = ? and role = 'admin'
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
        return response.status(500).json({message: 'System error'})
    }
}

// reception management
export const createNewReception = async(request, response) => {
    try {
        const newAccount = await createNewAccount(request.body);
        if(newAccount.status !== 201) {
            return response.status(newAccount.status).json(newAccount.message)
        }
        return response.status(201).json(newAccount.data);
    } catch (error) {
        console.log("createNewReception function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const loginReceptionistAccount = async(request, response) => {
    try {
        const {username, password} = request.body;
        if(!username || !password) {
            return response.status(400).json({message: 'Username and password are required.'});
        }
        const [rows] = await db.query(
            `
            select * from Account where username = ? and role = 'employee'
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
        return response.status(500).json({message: 'System error'})
    }
}

export const getAllReceptions = async(request, response) => {
    try {
        const receptions = await fetchAllReceptions();
        if (receptions.status !== 200) {
            return response.status(receptions.status).json({ message: receptions.message });
        }
        response.status(200).json(receptions.data);
    } catch (error) {
        console.log("getAllReceptions function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteReception = async(request, response) => {
    try {
        const result = await deleteReceptionByID(request.params.id);
        if (result.status !== 204) {
            return response.status(result.status).json({ message: result.message });
        }
        return response.status(204).json({message: "Receptionist deleted successfully."});
    } catch (error) {
        console.log("deleteReception function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateReception = async(request, response) => {
    try {

    } catch (error) {
        console.log("updateReception function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

// room management
export const getAllRooms = async(request, response) => {
    try {
        const rooms = await fetchAllRooms();
        if (rooms.status !== 200) {
            return response.status(rooms.status).json({ message: rooms.message });
        }
        response.status(200).json(rooms.data);
    } catch (error) {
        console.log("getAllRooms function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getRoomByID = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const room = await fetchRoomByID(id);
        response.status(200).json(room);
    } catch (error) {
        console.log("getRoomByID function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const addNewRoom = async (request, response) => {
    try {
        console.log("BODY:", request.body);
        console.log(request.file);

        const imageUrl = request.file ? request.file.path : null;

        const newRoom = await addRoom({
            ...request.body,
            image_url: imageUrl
        });

        response.status(201).json(newRoom.data);
    } catch (error) {
        console.log("addNewRoom function error:", error.message);
        response.status(500).json({ message: error.message || "System error" });
    }
};

export const updateRoom = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const roomData = request.body;
        console.log(id);
        console.log(roomData);
        const updatedRoom = await updatingRoom(id, roomData);
        if (updatedRoom.status !== 200) {
            return response.status(updatedRoom.status).json({message: updatedRoom.message});
        }
        response.status(200).json(updatedRoom);
    } catch (error) {
        console.log("updateRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteRoom = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const result = await deletingRoom(id);
        if(result.status !== 200) 
            return response.status(result.status).json({message: result.message});
        return response.status(200).send({message: result.message});
    } catch (error) {
        console.log("deleteRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const getAllRoomTypes = async(request, response) => {
    try {
        const result = await fetchAllRoomTypes();
        if (result.status !== 200) {
            return response.status(result.status).json({ message: result.message });
        }
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
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const updated = await updatingRoomType(id, request.body);
        if(updated.status !== 200) {
            response.status(updated.status).json({message: updated.message});
        }
        response.status(200).json(updated.data);
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteRoomType = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const result = await deletingRoomType(id);
        if(result.status !== 200) 
            return response.status(result.status).json(result.message);
        return response.status(200).send({message: result.message});
    } catch (error) {
        console.log("createNewRoomType function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

// service management
export const getAllServices = async(request, response) => {
    try {
        const services = await fetchAllServices();
        if(services.status !== 200) {
            return response.status(services.status).json({message: services.message});
        }
        response.status(200).json(services);
    } catch (error) {
        console.log("getAllServices function error: ", error.message);
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
        console.log("createNewService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const updateService = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const updated = await updatingService(id, request.body);
        if (updated.status !== 200) {
            return response.status(updated.status).json(updated.message)
        }
        response.status(200).json(updated); 
    } catch (error) {
        console.log("updateService function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteService = async(request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const result = await deletingService(id);
        if(result.status !== 200) 
            return response.status(result.status).json(result.message);
        return response.status(200).send(result.message);
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
        console.log("getAllServiceOrder function error: ", error.message);
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
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
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
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
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
        response.status(201).json(newBooking);
    } catch (error) {
        console.log("createNewBooking function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const deleteBooking = async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const result = await deletingBooking(id);

        if (result.status === 404) {
            return response.status(404).json({ message: result.message });
        }

        return response.status(204).send();
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

export const getPaymentsById = async (request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const payment = await fetchPaymentByID(id);
        response.status(200).json(payment);
    } catch (error) {
        console.log('getAllPaymentsById function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const createPayment = async (request, response) => {
    try {
        const newPayment = await addNewPayment(request.body);
        response.status(201).json(newPayment);
    } catch (error) {
        console.log('createPayment function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

// customer management
export const getAllCustomers = async (request, response) => {
    try {
        const customers = await fetchAllCustomers();
        if (customers.status != 200) {
            return response.status(customers.status).json({message: customers.message})
        }
        response.status(200).json(customers.data);
    } catch (error) {
        console.log('getAllCustomers function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const getCustomerInfo = async (request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const info = await getInfo(id);
        response.status(200).json(info);
    } catch (error) {
        console.log('getCustomerInfo function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const updateCustomerInfo = async (request, response) => {
    try {
        const id = parseInt(request.params.id, 10);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const updated = await updatingCustomerInfo(id, request.body);
        response.status(200).json(updated);
    } catch (error) {
        console.log('updateCustomerInfo function error: ', error);
        response.status(500).json({message: "System error"})
    }
}

export const deleteCustomer = async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        if (isNaN(id)) 
            return response.status(400).json({ message: "Invalid ID" });
        const result = await deletingCustomer(id);
        if(result.status !== 200) 
            return response.status(result.status).json(result.message);
        return response.status(200).json(result);
    } catch (error) {
        console.log('deleteCustomer function error: ', error);
        response.status(500).json({message: "System error"})
    }
}
