import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAllRooms = async() => {
    try {
        const res = await api.get("/available-rooms");
        return res.data;
    } catch (error) {
        console.log("Get all rooms error: ", error)
        throw error;
    }
}

export const createAccount = async (userData: {
    fullName: string;
    phone: string;
    username: string;
    email: string;
    password: string;}) => {
    try {
        const res = await api.post("/user/customer/register", userData);
        return res.data;
    } catch (error) {
        console.log("Create account error: ", error)
        throw error;
    }
}

export const login = async (credentials: {username: string; password: string;}, role: string) => {
    try {
        if(role === 'employee') {
            const res = await api.post("/admin/reception/login", credentials);
            return res.data;
        } else if (role === 'customer') {
            const res = await api.post("/user/customer/login", credentials);
            return res.data;
        } else if (role === 'admin') {
            const res = await api.post("/admin/login", credentials);
            return res.data;
        }
    } catch (error) {
        console.log("Login error: ", error)
        throw error;
    }   
}

export const getAvailableRooms = async (check_in: string, check_out: string, capacity: number) => {
    try {
        const res = await api.get("/user/available-rooms", {
            params: {
                check_in,
                check_out,
                capacity
            }
        });
        return {
            status: 200,
            data: res.data
        }
    } catch (error) {
        console.log("Get available rooms error: ", error)
        throw error;
    }
}

export const getAllAdditionalServices = async () => {
    try {
        const res = await api.get("/all-services");
        return res;
    } catch (error) {
        console.log("Get all additional services error: ", error);
        throw error;
    }
}

export const createNewReceptionAccount = async (employeeData: {username: string, password: string, fullName: string, phone: string, email: string, role: string }) => {
    try {
        const res = await api.post("/admin/reception", employeeData);
        return res.data;
    } catch (error) {
        console.log("Create employee account error: ", error);
        throw error;
    }
}

export const deleteExistedReceptionAccount = async (employeeID: number) => {
    try {
        const res = await api.delete(`/admin/reception/${employeeID}`);
        return res.data;
    } catch (error) {
        console.log("Delete employee account error: ", error);
        throw error;
    }
}

export const getAllReceptionists = async () => {
    try {
        const res = await api.get("/admin/reception");
        return res.data;
    } catch (error) {
        console.log("Get all receptionists error: ", error);
        throw error;
    }   
}

// room management APIs 
export const getAllRoomTypes = async () => {
    try {
        const res = await api.get("/admin/room-types");
        return res.data;
    } catch (error) {
        console.log("Get all room types error: ", error);
        throw error;
    }
}

export const addNewRoomType = async (roomTypeData: {type_name: string, capacity: number}) => {
    try {
        const res = await api.post("/admin/new-room-type", roomTypeData);  
        return res.data;
    } catch (error) {
        console.log("Add new room type error: ", error);
        throw error;
    }   
}

export const fetchRooms = async () => {
    try {
        const res = await api.get("/all-rooms");
        if (res.data?.status === 404) {
            console.log("No rooms found.");
            return [];
        }
        return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
        console.log("Fetch rooms error: ", error)
        throw error;
    }
}

export const addNewRoom = async (roomData: {room_number: string, room_type: string, price: number, status: string, description: string, image_url: string, area: number, standard: number, floor: number, services?: string[]}) => {
    try {
        const res = await api.post("/admin/new-room", roomData);
        return res.data;
    } catch (error) {
        console.log("Add new room error: ", error);
        throw error;
    }
}