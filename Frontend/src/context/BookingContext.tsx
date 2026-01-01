import { useQuery } from '@tanstack/react-query';
import type {Room} from '../context/RoomContext'
import type { AdditionalService } from './AdditionalServicesContext';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getAllBookings, addNewBooking, updatingBooking, deletingBooking } from '../apis/APIFunction';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface BookingData {
    booking_id: number,
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

    console.log(bookings);

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
        try {
            const res = await updatingBooking(id, bookingData);
            console.log(res);
            if(res.status !== 200) {
                if(res.status === 403) {
                    console.log(1);
                    toast.error(<span className='mess'>{res.message}</span>);
                    return;
                }
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Update a booking successfully!</span>);
            refetchBookings();
        } catch (error) {
            console.log('Update booking error:', error);
        }
    }

    const deleteBooking = async (id: number) => {
        try {
            const res = await deletingBooking(id);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Delete a booking successfully!</span>);
            refetchBookings();
        } catch (error) {
            console.log('Delete booking error', error);
        }
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