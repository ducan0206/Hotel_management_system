import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Button } from "../../ui/button.tsx";
import { Badge } from "../../ui/badge.tsx";
import { Separator } from "../../ui/separator.tsx";
import { useBooking, type BookingData } from "../../context/BookingContext.tsx";
import { ImageWithFallback } from "../utils/ImageWithFallback.tsx";
import { CalendarIcon, Users, Wifi, Tv, Wine, Sparkles, MessageSquare, User, Lock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface BookingSummaryProps {
    bookingData: BookingData;
    onProceedToPayment: () => void;
}

export function BookingSummary({ bookingData, onProceedToPayment }: BookingSummaryProps) {
    const { addBooking } = useBooking();
    const { room, checkIn, checkOut, guests, additionalServices = [], specialRequest, guestInfo } = bookingData;

    const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
    
    const roomTotal = nights * room.price;
    const servicesTotal = additionalServices?.reduce((sum, service) => sum + Number(service.price), 0);
    
    const subtotal = roomTotal + servicesTotal;
    const tax = subtotal * 0.1; 
    const serviceFee = 25;
    const total = subtotal + tax + serviceFee;

    const handleSubmitPayment = () => {
        if (window.confirm('Are you sure you want to book this room?')) {
            addBooking(bookingData);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="sticky top-24 shadow-lg border-t-4 border-t-cyan-500">
                <CardHeader>
                    <CardTitle className="text-xl text-cyan-700">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Room Image and Info */}
                    <div className="space-y-3">
                        <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
                            <ImageWithFallback
                                src={room.image_url}
                                alt={room.standard}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-white/90 text-cyan-700 font-bold shadow-sm backdrop-blur-sm">
                                    {room.standard}
                                </Badge>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Room {room.room_id} - {room.type_name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><Wifi className="w-3 h-3"/> Free Wifi</div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><Tv className="w-3 h-3"/> TV</div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><Wine className="w-3 h-3"/> Mini Bar</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Booking Details */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Stay Details</h4>
                        
                        {/* Dates */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Check-in &mdash; Check-out</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">
                                    {checkIn && checkOut ? (
                                        <>
                                            {format(checkIn, "MMM dd")} &mdash; {format(checkOut, "MMM dd, yyyy")}
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic">Select dates</span>
                                    )}
                                </p>
                                {nights > 0 && (
                                    <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-2 py-0.5 rounded-full">
                                        {nights} {nights === 1 ? 'night' : 'nights'} stay
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Guests</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">
                                    {guests.adults} Adult{guests.adults > 1 && 's'}
                                    {guests.children > 0 && `, ${guests.children} Child${guests.children > 1 ? 'ren' : ''}`}
                                </p>
                            </div>
                        </div>
                        
                        {/* Contact Info */}
                        {(guestInfo.email || guestInfo.phone) && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Primary Contact</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">
                                        {guestInfo.fullName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                        <span>{guestInfo.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Services Section */}
                    {additionalServices.length > 0 && (
                        <>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Extras Selected
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                {additionalServices.map((service) => (
                                    <div key={service.service_id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <li> {service.service_name} </li>
                                        </span>
                                        <span className="font-medium text-gray-900">${service.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </>
                    )}

                    {/* Special Requests Section */}
                    {specialRequest && (
                        <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                Special Requests
                            </h4>
                            <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                                "{specialRequest}"
                            </p>
                        </div>
                        </>
                    )}

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3 pt-2">
                        <h4 className="font-semibold text-gray-700">Payment Details</h4>
                        
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Room charge ({nights} nights)
                            </span>
                            <span className="text-gray-900 font-medium">${roomTotal.toFixed(2)}</span>
                        </div>

                        {/* Hi?n th? dòng t?ng ti?n d?ch v? thêm n?u có */}
                        {servicesTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Additional Services</span>
                                <span className="text-gray-900 font-medium">${servicesTotal.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service fee</span>
                            <span className="text-gray-900 font-medium">${serviceFee.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (10%)</span>
                            <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                        </div>

                        <div className="border-t border-dashed pt-3 mt-2">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-cyan-600">${total.toFixed(2)}</span>
                                    <p className="text-xs text-gray-400 font-normal">Includes taxes & fees</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-md text-lg font-semibold py-6"
                        size="lg"
                        onClick={handleSubmitPayment}
                        disabled={!checkIn || !checkOut || nights === 0}
                    >
                        Confirm & Pay
                    </Button>

                    <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Secure booking process
                    </p>
                </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="bg-gray-50 border-none shadow-inner">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-gray-500">
                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Free cancellation within 24 hours</p>
                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> 50% refund if canceled after 24 hours</p>
                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> No refund within 48h of check-in</p>
                </CardContent>
            </Card>
        </div>
    );
}