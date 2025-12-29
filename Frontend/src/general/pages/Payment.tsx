import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingByBookingId } from "../../apis/APIFunction.ts";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card.tsx";
import { Button } from "../../ui/button.tsx";
import { Input } from "../../ui/input.tsx";
import { Label } from "../../ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "../../ui/radioGroup.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Skeleton } from "../../ui/skeleton.tsx";

import { 
    CreditCard, QrCode, Banknote, Users, 
    BedDouble, Mail, Phone, CheckCircle, Loader2, ListChecks
} from "lucide-react";
import { ImageWithFallback } from "../utils/ImageWithFallback.tsx"; 

interface BookingDetail {
    check_in: string;
    check_out: string;
    total_price: number;
    specialRequest: string | null;
    full_name: string;
    phone: string;
    email: string;
    address: string;
    date_of_birth: string;
    id_card: string;
    gender: string;
    nights: number;
    adutls: number; 
    children: number;
    room_number: string;
    image_url: string;
    type_name: string;
}

export default function PaymentPage() {
    const { booking_id } = useParams();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: responseData, isLoading, isError } = useQuery({
        queryKey: ['bookingDetail', booking_id],
        queryFn: () => getBookingByBookingId(Number(booking_id)),
        enabled: !!booking_id
    });

    const booking: BookingDetail | undefined = responseData?.data ? responseData.data[0] : undefined;

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            navigate("/payment-success"); 
        }, 2000);
    };

    if (isLoading) return <PaymentSkeleton />;
    if (isError || !booking) return <div className="text-center mt-20 text-red-500">Booking not found or Error loading data.</div>;

    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);
    const total = Number(booking.total_price);

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ListChecks className="w-4 h-10"></ListChecks>
                    Confirm & Payment
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left column */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-0 shadow-lg overflow-hidden sticky top-24">
                            <div className="bg-slate-600 text-white p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-1">Receipt for</p>
                                        <h2 className="text-xl font-bold">{booking.full_name}</h2>
                                        <div className="flex gap-4 mt-2 text-slate-400 text-xs">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {booking.email}</span>
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {booking.phone}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-lg">PASK HOTEL</h3>
                                        <p className="text-xs text-slate-400">#{booking_id}</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                {/* Room image */}
                                <div className="relative h-48 w-full">
                                    <ImageWithFallback 
                                        src={booking.image_url} 
                                        alt={booking.type_name} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <p className="text-white font-bold text-lg">{booking.type_name}</p>
                                        <p className="text-cyan-300 text-sm font-medium">Room {booking.room_number}</p>
                                    </div>
                                </div>

                                {/* Booking details */}
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Check-in</p>
                                            <p className="font-bold text-slate-900">{format(checkInDate, "dd MMM yyyy")}</p>
                                            <p className="text-xs text-slate-400">From 14:00</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Check-out</p>
                                            <p className="font-bold text-slate-900">{format(checkOutDate, "dd MMM yyyy")}</p>
                                            <p className="text-xs text-slate-400">Before 12:00</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 flex items-center gap-2">
                                                <BedDouble className="w-4 h-4" /> Duration
                                            </span>
                                            <span className="font-medium">{booking.nights} Nights</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Guests
                                            </span>
                                            <span className="font-medium">{booking.adutls} Adults, {booking.children} Children</span>
                                        </div>
                                        {booking.specialRequest && (
                                            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mt-2">
                                                <p className="text-xs text-yellow-800 font-semibold mb-1">Special Request:</p>
                                                <p className="text-xs text-yellow-700 italic">"{booking.specialRequest}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-slate-900">Total Amount</span>
                                        <span className="text-3xl font-extrabold text-cyan-600">${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-right text-slate-400">Includes taxes & fees</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle>Secure Payment</CardTitle>
                                <CardDescription>All transactions are secure and encrypted.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="grid gap-4">
                                    
                                    {/* Method 1: Credit Card */}
                                    <div>
                                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                        <Label
                                            htmlFor="card"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-500 [&:has([data-state=checked])]:border-cyan-500 cursor-pointer"
                                        >
                                            <div className="flex w-full items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-6 w-6 text-cyan-600" />
                                                    <span className="font-semibold text-base">Credit Card</span>
                                                </div>
                                                <CheckCircle className="h-5 w-5 text-cyan-600 opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity" />
                                            </div>
                                            
                                            {paymentMethod === 'card' && (
                                                <div className="w-full mt-4 grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="col-span-2 space-y-1">
                                                        <Label className="text-xs">Card Number</Label>
                                                        <Input placeholder="0000 0000 0000 0000" className="bg-slate-50" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Expiry</Label>
                                                        <Input placeholder="MM/YY" className="bg-slate-50" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">CVC</Label>
                                                        <Input type="password" placeholder="123" className="bg-slate-50" />
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <Label className="text-xs">Cardholder Name</Label>
                                                        <Input placeholder="NGUYEN VAN A" className="bg-slate-50" />
                                                    </div>
                                                </div>
                                            )}
                                        </Label>
                                    </div>

                                    {/* Method 2: QR Code */}
                                    <div>
                                        <RadioGroupItem value="qr" id="qr" className="peer sr-only" />
                                        <Label
                                            htmlFor="qr"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-500 cursor-pointer"
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <QrCode className="h-6 w-6 text-purple-600" />
                                                    <span className="font-semibold text-base">E-Wallet / QR Code</span>
                                                </div>
                                            </div>
                                            {paymentMethod === 'qr' && (
                                                <div className="w-full mt-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg animate-in fade-in">
                                                    <div className="w-40 h-40 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="w-full h-full opacity-80"/>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-2">Scan with Momo / ZaloPay / Banking App</p>
                                                </div>
                                            )}
                                        </Label>
                                    </div>

                                    {/* Method 3: Pay at Hotel */}
                                    <div>
                                        <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                        <Label
                                            htmlFor="cash"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-500 cursor-pointer"
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="h-6 w-6 text-green-600" />
                                                    <span className="font-semibold text-base">Pay at Hotel</span>
                                                </div>
                                            </div>
                                            {paymentMethod === 'cash' && (
                                                <p className="w-full text-sm text-slate-500 mt-2 pl-8">
                                                    You can pay in cash or card when you arrive at the reception.
                                                </p>
                                            )}
                                        </Label>
                                    </div>

                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4">
                             <div className="flex items-start gap-2 text-sm text-slate-500 bg-blue-50 p-4 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                <p>By clicking the button below, you agree to Pask Hotel's Terms & Conditions and Cancellation Policy.</p>
                             </div>

                            <Button 
                                size="lg" 
                                className="w-full text-xl py-8 font-bold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-xl"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `PAY $${total.toFixed(2)}`
                                )}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function PaymentSkeleton() {
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 mt-12">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                    <Skeleton className="h-[600px] w-full rounded-xl" />
                </div>
                <div className="lg:col-span-7 space-y-6">
                     <Skeleton className="h-[400px] w-full rounded-xl" />
                     <Skeleton className="h-[60px] w-full rounded-xl" />
                </div>
            </div>
        </div>
    )
}