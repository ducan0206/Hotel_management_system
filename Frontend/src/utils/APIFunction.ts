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
    }
}