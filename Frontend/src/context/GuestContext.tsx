import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updateGuestInfo, getAllCustomers, deleteGuest as deletingGuest } from '../apis/APIFunction';
import { toast } from 'sonner';

export interface Guest {
    user_id: number,
    KH_id: string,
    full_name: string,
    phone: string,
    email: string,
    id_card: string,
    date_of_birth: string, 
    gender: string, 
    address: string,
    username: string,
    created_at: Date,
    total_booking: number,
    total_spent: number
}

interface GuestContextType {
    guests: Guest[];
    updateGuest: (id: number, guest: Partial<Guest>) => void;
    deleteGuest: (id: number) => void;
    searchGuests: (query: string) => Guest[];
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
    const { data: guests = [], refetch: refetchCustomers } = useQuery({
        queryKey: ['guests'],
        queryFn: getAllCustomers
    })

    const updateGuest = async (id: number, guest: Partial<Guest>) => {
        try {
            const res  = await updateGuestInfo(id, guest);
            if (res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Update guest info successfully!</span>)
            refetchCustomers();
        } catch (error) {
            console.log('Update guest info error:', error);
        }
    };

    const deleteGuest = async (id: number) => {
       try {
            const res = await deletingGuest(id);
            console.log(res);
            if (res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Update guest info successfully!</span>)
            refetchCustomers();
       } catch (error) {
            console.log("Delete guest error:", error);
       }
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
            updateGuest,
            deleteGuest,
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
