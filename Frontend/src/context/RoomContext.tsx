import { createContext, useContext, useState, type ReactNode } from 'react';
import { getAllRoomTypes, addNewRoomType, fetchRooms, addNewRoom } from '../apis/APIFunction';
import { useQuery } from '@tanstack/react-query';

export interface RoomType {
    type_id: string | number;
    type_name: string;
    capacity: number;
}

export interface Room {
    room_id: string | number;
    room_type: RoomType;
    room_number: string;
    price: number;
    status: 'available' | 'booked' | 'maintenance';
    description: string;
    image_url: string;
    area: number;
    standard: 'Deluxe' | 'Suite' | 'Standard';
    floor: number;
    services: string[];
    created_at: string;
}

interface RoomContextType {
    roomTypes: RoomType[];
    rooms: Room[];
    addRoomType: (roomTypeData: any) => Promise<void>;
    updateRoomType: (id: string, roomType: Partial<RoomType>) => void;
    deleteRoomType: (id: string | number) => void;
    addRoom: (roomData: any) => Promise<void>;
    updateRoom: (id: string, room: Partial<Room>) => void;
    deleteRoom: (id: string) => void;
    getRoomType: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
    const { data: roomTypes, refetch: refetchRoomTypes } = useQuery({
        queryKey: ['roomTypes'],
        queryFn: getAllRoomTypes,
    });

    const { data: rooms, refetch: refetchRooms } = useQuery({
        queryKey: ['rooms'],
        queryFn: fetchRooms,
    });

    const addRoomType = async (roomTypeData: any) => {
        try {
            await addNewRoomType(roomTypeData);
            refetchRoomTypes();
        } catch (error) {
            console.error("Error adding room type:", error);
        }
    };

    const updateRoomType = (id: string, roomType: Partial<RoomType>) => {
        
    };

    const deleteRoomType = (id: string | number) => {
        
    };

    const addRoom = async (roomData: any) => {
        try {
            await addNewRoom(roomData);
            refetchRooms();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    const updateRoom = (id: string, room: Partial<Room>) => {

    };

    const deleteRoom = (id: string) => {
        
    };

    const getRoomType = () => {
        refetchRoomTypes();
    }

    return (
        <RoomContext.Provider value={{
            roomTypes,
            rooms,
            addRoomType,
            updateRoomType,
            deleteRoomType,
            addRoom,
            updateRoom,
            deleteRoom,
            getRoomType
        }}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRooms() {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error('useRooms must be used within a RoomProvider');
    }
    return context;
}
