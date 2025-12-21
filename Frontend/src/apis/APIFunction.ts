import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface AddRoomPayload {
    room_number: string;
    room_type: string;
    price: number;
    status: string;
    description: string;
    area: number;
    standard: string;
    floor: number;
    services?: string[];
    image?: File | null;
}

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
        if (res.data?.status === 404) {
            console.log("No room types found.");
            return [];
        }
        return Array.isArray(res.data?.data) ? res.data.data : [];
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

export const addNewRoom = async (roomData: AddRoomPayload) => {
    try {
        const formData = new FormData();

        formData.append("room_number", roomData.room_number);
        formData.append("room_type", roomData.room_type);
        formData.append("price", String(roomData.price));
        formData.append("status", roomData.status);
        formData.append("description", roomData.description);
        formData.append("area", String(roomData.area));
        formData.append("standard", roomData.standard);
        formData.append("floor", String(roomData.floor));

        if (roomData.services?.length) {
            formData.append("services", JSON.stringify(roomData.services));
        }

        if (roomData.image) {
            formData.append("image", roomData.image); 
        }

        const res = await api.post("/admin/add-room", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error) {
        console.log("Add new room error:", error);
        throw error;
    }
};
