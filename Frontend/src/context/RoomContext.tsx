import { createContext, useContext, type ReactNode } from 'react';
import { getAllRoomTypes, addNewRoomType, fetchRooms, addNewRoom } from '../apis/APIFunction';
import { useQuery } from '@tanstack/react-query';

export interface RoomType {
    type_id: string | number;
    type_name: string;
    capacity: number;
}

export interface Room {
    room_id: number,
    room_type: number,       
    room_number: string,
    price: number,
    status: 'available' | 'booked' | 'maintenance',
    description: string,
    image_url: string,
    area: number,
    standard: 'Deluxe' | 'Suite' | 'Standard',
    floor: number,
    services: any,            
    created_at: string,
    updated_at: string,
    type_name: string,
    capacity: number
}

export interface AddRoomPayload {
    room_number: string;
    room_type: string;        
    price: number;
    status: 'available' | 'booked' | 'reserved';
    description: string;
    area: number;
    standard: 'Deluxe' | 'Suite' | 'Standard';
    floor: number;
    services?: string[];
    image?: File | null;      
}

interface RoomContextType {
    roomTypes: RoomType[];
    rooms: Room[];
    addRoomType: (roomTypeData: any) => Promise<void>;
    updateRoomType: (id: string, roomType: Partial<RoomType>) => void;
    deleteRoomType: (id: string | number) => void;
    addRoom: (roomData: AddRoomPayload) => Promise<void>;
    updateRoom: (id: string, room: Partial<Room>) => void;
    deleteRoom: (id: number) => void;
    getRoomTypeById: (id: string | number) => RoomType | undefined;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
    const { data: roomTypes, refetch: refetchRoomTypes } = useQuery({
        queryKey: ['roomTypes'],
        queryFn: getAllRoomTypes,
    });

    const { data: rooms = [], refetch: refetchRooms } = useQuery({
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

    const addRoom = async (roomData: AddRoomPayload) => {
        try {
            await addNewRoom(roomData);
            refetchRooms();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    const updateRoom = (id: string, room: Partial<Room>) => {

    };

    const deleteRoom = (id: number) => {
        
    };

    const getRoomTypeById = (id: string | number): RoomType | undefined => {
        return roomTypes?.find(
            (type: RoomType) => String(type.type_id) === String(id)
        );
    };


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
            getRoomTypeById
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
