import { useQuery } from '@tanstack/react-query';
import type {Room} from '../context/RoomContext'
import type { AdditionalService } from './AdditionalServicesContext';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getAllBookings, addNewBooking } from '../apis/APIFunction';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface BookingData {
    user_id: number;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    room: Room;
    additionalServices: AdditionalService[];
    guests: {
        adults: number;
        children: number;
    };
    specialRequest: string;
    booking_id: number,
    guestInfo: {
        fullName: string;
        idCard: string,
        dateOfBirth: string,
        gender: string, 
        email: string;
        phone: string;
        address: string;
    };
}

interface BookingContextType {
    currentBookingId: number,
    bookings: BookingData[];
    addBooking: (bookingData: any) => void; // return id
    updateBooking: (id: number, bookingData: any) => void;
    deleteBooking: (id: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({children}: {children: ReactNode}) {
    const { data: bookings = [], refetch: refetchBookings } = useQuery<BookingData[]>({
        queryKey: ['bookings'],
        queryFn: getAllBookings
    });

    const navigate = useNavigate();

    // current booking
    const [currentBookingId, setCurrentBookingId] = useState(0);

    const addBooking = async (bookingData: any) => {
        try {
            const res = await addNewBooking(bookingData);
            const newBookingId = res.data?.bookingId || res.id;
            if(res.status === 200 && newBookingId) {
                console.log(newBookingId);
                setCurrentBookingId(newBookingId);
                toast.success(<span className='mess'>Add a new booking successfully!</span>);
                refetchBookings();
                navigate(`/payment/${newBookingId}`);
            } else {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
        } catch (error) {
            console.log('Add new booking error:', error);
        }
    }

    const updateBooking = async (id: number, bookingData: any) => {

    }

    const deleteBooking = async (id: number) => {

    }

    return (
        <BookingContext.Provider value={{
            currentBookingId,
            bookings,
            addBooking,
            updateBooking,
            deleteBooking
        }}>
            {children}
        </BookingContext.Provider>
    )
}

export function useBooking() {
    const context = useContext(BookingContext);
    if(context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}