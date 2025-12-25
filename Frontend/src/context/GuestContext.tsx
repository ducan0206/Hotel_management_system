import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCustomers } from '@/apis/APIFunction';

export interface Guest {
    id: string,
    KH_id: string,
    full_name: string,
    phone: string,
    email: string,
    username: string,
    created_at: Date,
    total_booking: number,
    total_spent: number
}

export interface BookingHistory {
    id: string;
    guestId: string;
    roomNumber: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    status: 'completed' | 'cancelled' | 'no-show';
}

interface GuestContextType {
    guests: Guest[];
    bookingHistory: BookingHistory[];
    addGuest: (guestData: any) => void;
    updateGuest: (id: string, guest: Partial<Guest>) => void;
    deleteGuest: (id: string) => void;
    getGuestBookings: (guestId: string) => BookingHistory[];
    searchGuests: (query: string) => Guest[];
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
    const { data: guests = [], refetch: refetchCustomers } = useQuery({
        queryKey: ['guests'],
        queryFn: getAllCustomers
    })

    const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([
        {
            id: 'bh1',
            guestId: 'g1',
            roomNumber: '301',
            roomType: 'Presidential Suite',
            checkIn: '2024-12-01',
            checkOut: '2024-12-05',
            totalAmount: 5000000,
            status: 'completed'
        },
        {
            id: 'bh2',
            guestId: 'g1',
            roomNumber: '201',
            roomType: 'Executive Suite',
            checkIn: '2024-11-15',
            checkOut: '2024-11-18',
            totalAmount: 3000000,
            status: 'completed'
        },
        {
            id: 'bh3',
            guestId: 'g2',
            roomNumber: '101',
            roomType: 'Deluxe Room',
            checkIn: '2024-12-10',
            checkOut: '2024-12-12',
            totalAmount: 1500000,
            status: 'completed'
        },
        {
            id: 'bh4',
            guestId: 'g3',
            roomNumber: '102',
            roomType: 'Deluxe Room',
            checkIn: '2024-12-05',
            checkOut: '2024-12-08',
            totalAmount: 1800000,
            status: 'completed'
        },
        {
            id: 'bh5',
            guestId: 'g4',
            roomNumber: '301',
            roomType: 'Presidential Suite',
            checkIn: '2024-11-20',
            checkOut: '2024-11-25',
            totalAmount: 6000000,
            status: 'completed'
        },
        {
            id: 'bh6',
            guestId: 'g5',
            roomNumber: '101',
            roomType: 'Deluxe Room',
            checkIn: '2024-10-15',
            checkOut: '2024-10-16',
            totalAmount: 1500000,
            status: 'cancelled'
        }
    ]);

    const addGuest = async (guestData: any) => {
        
    };

    const updateGuest = async (id: string, guest: Partial<Guest>) => {
        
    };

    const deleteGuest = async (id: string) => {
       
    };

    const getGuestBookings = (guestId: string) => {
        return bookingHistory.filter(booking => booking.guestId === guestId);
    };

    const searchGuests = (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        
        return guests.filter((guest: Guest) => 
            guest.full_name.toLowerCase().includes(lowercaseQuery) ||
            guest.email.toLowerCase().includes(lowercaseQuery) ||
            guest.phone.includes(query)
        );
    };

    return (
        <GuestContext.Provider value={{
            guests,
            bookingHistory,
            addGuest,
            updateGuest,
            deleteGuest,
            getGuestBookings,
            searchGuests
        }}>
            {children}
        </GuestContext.Provider>
    );
}

export function useGuests() {
    const context = useContext(GuestContext);
    if (context === undefined) {
        throw new Error('useGuests must be used within a GuestProvider');
    }
    return context;
}
