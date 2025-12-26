import { useState } from "react";
import { BookingForm } from "../component/BookingForm.tsx";
import { BookingSummary } from "../component/BookingSummary.tsx";
import { Hotel, ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button.tsx";
import { useNavigate, useLocation } from 'react-router-dom'
import type { Room } from '../../context/RoomContext.tsx'

export interface BookingData {
    room: Room;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    guests: {
        adults: number;
        children: number;
    };
    guestInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        zipCode: string;
    };
    specialRequests: string;
}

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {selectedRoom: room} = location.state as { selectedRoom: Room };

    const [currentStep, setCurrentStep] = useState<"booking" | "payment">("booking");
    const [bookingData, setBookingData] = useState<BookingData>(() => {
        return {
            room: room,
            checkIn: undefined,
            checkOut: undefined,
            guests: {
                adults: 1,
                children: 0,
            },
            guestInfo: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                country: "",
                zipCode: "",
            },
            specialRequests: "",
        }
    })

    const handleBookingChange = (updates: Partial<BookingData>) => {
        setBookingData((prev) => ({ ...prev, ...updates }));
    };

    const handleProceedToPayment = () => {
        // Validate required fields
        const { guestInfo, checkIn, checkOut } = bookingData;
        if (!checkIn || !checkOut || !guestInfo.firstName || !guestInfo.lastName || 
            !guestInfo.email || !guestInfo.phone) {
        alert("Please fill in all required fields");
        return;
        }
        setCurrentStep("payment");
    };

    return (
        <div className="min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                        <Hotel className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-gray-900">Book Your Room</h2>
                        <p className="text-sm text-gray-500">
                        Complete your booking information
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 font-2lg" onClick={() => navigate('/all-rooms')}>
                    <ArrowLeft className="w-4 h-4" />
                    Return 
                </Button>
            </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form - Left Side */}
            <div className="lg:col-span-2">
                <BookingForm
                    bookingData={bookingData}
                    onBookingChange={handleBookingChange}
                />
            </div>

            {/* Booking Summary - Right Side */}
            <div className="lg:col-span-1">
                <BookingSummary 
                    bookingData={bookingData}
                    onProceedToPayment={handleProceedToPayment}
                />
            </div>
            </div>
        </div>
        </div>
    );
}

export default Booking