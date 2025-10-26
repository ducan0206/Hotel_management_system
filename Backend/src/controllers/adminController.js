import {fetchAllRooms, addRoom, updatingRoom, editingRoom, deletingRoom} from '../services/roomService.js'

export const getAllRooms = async(request, response) => {
    try {
        const rooms = await fetchAllRooms();
        response.status(200).json(rooms);
    } catch (error) {cd
        console.log("getAllRooms function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const addNewRoom = async(request, response) => {
    try {
        const newRoom = await addRoom(request.body);
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
        const id = request.params.id;
        const updatedRoom = await updatingRoom(id, request.body);
        response.status(200).json(updatedRoom);
    } catch (error) {
        console.log("updateRoom function error: ", error.message);
        response.status(500).json({message: "System error"});
    }
}

export const editRoom = async(request, response) => {
    try {
        const id = request.params.id;
        const editedRoom = await editingRoom(id);
        response.status(200).json(editedRoom);
    } catch (error) {
        console.log("editRoom function error: ", error.message);
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