import { createContext, useContext, type ReactNode } from 'react';
import { getAllRoomTypes, addNewRoomType, fetchRooms, addNewRoom, deletingRoom, deletingRoomType, updatingRoomType , updatingRoom} from '../apis/APIFunction';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner'

export interface RoomType {
    type_id: number;
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
    room_type: number;        
    price: number;
    status: 'available' | 'booked' | 'maintenance';
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
    updateRoomType: (id: number, roomType: Partial<RoomType>) => void;
    deleteRoomType: (id: number) => void;
    addRoom: (roomData: AddRoomPayload) => Promise<void>;
    updateRoom: (id: number, room: AddRoomPayload) => void;
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

    const updateRoomType = async (id: number, roomType: Partial<RoomType>) => {
        try {
            const res = await updatingRoomType(id, roomType);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Update room type successfullly!</span>);
            refetchRoomTypes();
        } catch (error) {
            console.log("Error updating room type:", error);
        }
    };

    const deleteRoomType = async (id: number) => {
        try {
            const res = await deletingRoomType(id);
            if(res.status !== 200) {
                toast.error(<span className="mess">{res.message}</span>);
                return;
            }
            toast.success(<span className="mess">Delete room type successfully!</span>)
            refetchRoomTypes();
        } catch (error) {
            console.log("Error deleting room:", error)
        }
    };

    const addRoom = async (roomData: AddRoomPayload) => {
        try {
            await addNewRoom(roomData);
            refetchRooms();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    const updateRoom = async (id: number, room: AddRoomPayload) => {
        try {
            const res = await updatingRoom(id, room);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>)
                return;
            }
            toast.success(<span className='mess'>Update room successfully!</span>);
            refetchRooms();
        } catch (error) {
            console.log("Error updating room:", error);
        }
    };

    const deleteRoom = async (id: number) => {
        try {
            const res = await deletingRoom(id);
            if(res.status !== 200) {
                toast.error(<span className="mess">{res.message}</span>)
            }
            toast.success(<span className="mess">Delete room successfully!</span>)
            refetchRooms();
        } catch (error) {
            console.log("Error deleting room:", error)
        }
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
