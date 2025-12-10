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

export const fetchRooms = async () => {
    try {
        const res = await api.get("/all-rooms");
        return res.data;
    } catch (error) {
        console.log("Fetch rooms error: ", error)
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
