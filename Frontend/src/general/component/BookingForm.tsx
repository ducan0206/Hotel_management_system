import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { Textarea } from "../../ui/textarea.tsx";
import { Checkbox } from '../../ui/checkbox.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.tsx";
import type { BookingData } from "../../context/BookingContext.tsx";
import { Paintbrush, WavesLadder, Projector, WashingMachine, LandPlot, Plane, Gift, CalendarIcon, User, Phone, Mail, Bubbles, Baby, Users, Bus, Motorbike, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import { useAdditionalServices, type AdditionalService } from '../../context/AdditionalServicesContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx'
import { getAccountInfo } from "../../apis/APIFunction.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface BookingFormProps {
    bookingData: BookingData;
    onBookingChange: (updates: Partial<BookingData>) => void;
}

export function BookingForm({ bookingData, onBookingChange }: BookingFormProps) {
    const {user} = useAuth();

    const { data: userInfo } = useQuery({
        queryKey: ['userInfo', user?.user_id],
        queryFn: () => getAccountInfo(Number(user?.user_id))
    })

    const {services} = useAdditionalServices();
    const [availableServices, setAvailableServices] = useState<AdditionalService[]>();

    useEffect(() => {
        const avaiServices = services.filter(s => s.status === 'Available');
        setAvailableServices(avaiServices);
    }, [services]);

    useEffect(() => {
        if(!user || !userInfo) {
            console.log(1);
            return;
        }
        onBookingChange({
            user_id: Number(user?.user_id),
            guestInfo: {
                fullName: userInfo.full_name,
                idCard: userInfo.id_card,
                dateOfBirth: userInfo.date_of_birth,
                gender: userInfo.gender,
                email: userInfo.email,
                phone: userInfo.phone,
                address: userInfo.address
            }
        })
    }, [userInfo, user])

    const handleGuestsChange = (field: "adults" | "children", value: number) => {
        onBookingChange({
            guests: {
                ...bookingData.guests,
                [field]: value,
            },
        });
    };

    const getAmenityIcon = (amenity: string) => {
        const lower = amenity.toLowerCase();
        if (lower.includes("city tour")) return <Bus className="w-4 h-4" />;
        if (lower.includes("motorbike")) return <Motorbike className="w-4 h-4" />;
        if (lower.includes("gym")) return <Dumbbell className="w-4 h-4" />;
        if (lower.includes("meeting")) return <Projector className="w-4 h-4" />;
        if (lower.includes("laundry")) return <WashingMachine className="w-4 h-4" />;
        if (lower.includes("tennis")) return <LandPlot className="w-4 h-4" />;
        if (lower.includes("air port")) return <Plane className="w-4 h-4" />;
        if (lower.includes("gift")) return <Gift className="w-4 h-4" />;
        if (lower.includes("spa")) return <Bubbles className="w-4 h-4" />;
        if (lower.includes("pool")) return <WavesLadder className="w-4 h-4"/>;
        if (lower.includes("decoration")) return <Paintbrush className="w-4 h-4"/>;
        return null;
    };

    function toggleAdditionalService(service: AdditionalService) {
        const currentServices = bookingData.additionalServices || [];
        const exists = currentServices.some(s => s.service_id === service.service_id);
        let newServices;
        if (exists) {
            newServices = currentServices.filter(s => s.service_id !== service.service_id);
        } else {
            newServices = [...currentServices, service];
        }
        onBookingChange({
            additionalServices: newServices
        })
    }
  
    return (
        <div className="space-y-6">
            {/* Guest Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.full_name || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Identity number *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.id_card || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Date of birth *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.date_of_birth || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Gender *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.gender || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.email || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                    {userInfo?.phone || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Address *</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-gray-700">
                                {userInfo?.address || "N/A"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dates and Guests */}
            <Card>
                <CardHeader>
                    <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Check-in Date */}
                        <div className="space-y-2">
                            <Label>Check-in Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={bookingData.checkIn ? format(bookingData.checkIn, "yyyy-MM-dd") : ""}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : undefined;
                                        onBookingChange({ checkIn: date });
                                    }}
                                    min={format(new Date(), "yyyy-MM-dd")}
                                    max={bookingData.checkOut ? format(bookingData.checkOut, "yyyy-MM-dd") : undefined}
                                    className="w-full pl-10 justify-start text-left font-normal block"
                                    style={{ colorScheme: "light" }}
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>

                        {/* Check-out Date */}
                        <div className="space-y-2">
                            <Label>Check-out Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={bookingData.checkOut ? format(bookingData.checkOut, "yyyy-MM-dd") : ""}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : undefined;
                                        onBookingChange({ checkOut: date });
                                    }}
                                    min={bookingData.checkIn 
                                        ? format(bookingData.checkIn, "yyyy-MM-dd") 
                                        : format(new Date(), "yyyy-MM-dd")
                                    }
                                    className="w-full pl-10 justify-start text-left font-normal block"
                                    style={{ colorScheme: "light" }}
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Adults */}
                        <div className="space-y-2">
                            <Label htmlFor="adults">Adults</Label>
                            <div className='relative'>
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Select
                                    value={bookingData.guests.adults.toString()}
                                    onValueChange={(value) => handleGuestsChange("adults", parseInt(value))}
                                >
                                    <SelectTrigger id="adults" className='pl-10'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Adult</SelectItem>
                                        <SelectItem value="2">2 Adults</SelectItem>
                                        <SelectItem value="3">3 Adults</SelectItem>
                                        <SelectItem value="4">4 Adults</SelectItem>
                                        <SelectItem value="5">5 Adults</SelectItem>
                                        <SelectItem value="6">6 Adults</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="space-y-2">
                            <Label htmlFor="children">Children</Label>
                            <div className='relative'>
                                <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Select
                                    value={bookingData.guests.children.toString()}
                                    onValueChange={(value) => handleGuestsChange("children", parseInt(value))}
                                >
                                    <SelectTrigger id="children" className='pl-10'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">0 Children</SelectItem>
                                        <SelectItem value="1">1 Child</SelectItem>
                                        <SelectItem value="2">2 Children</SelectItem>
                                        <SelectItem value="3">3 Children</SelectItem>
                                        <SelectItem value="4">4 Children</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Additional services */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Additional Services</CardTitle>
                    <p className="text-sm text-slate-500">
                        Choose extra services to enhance your stay
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {availableServices?.map((service) => {
                            const isSelected = (bookingData.additionalServices || []).some(
                                (s) => s.service_id === service.service_id
                            );

                            return (
                                <div
                                    key={service.service_id}
                                    onClick={() => toggleAdditionalService(service)}
                                    className={`
                                        group relative flex items-start p-4 rounded-xl border cursor-pointer transition-all 
                                        ${isSelected 
                                        ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-400" 
                                        : "border-slate-200 hover:border-blue-400 hover:shadow-sm hover:bg-slate-50"
                                        }
                                    `}
                                >
                                {/* Checkbox */}
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleAdditionalService(service)}
                                        className="flex justify-center mt-1 cursor-pointer items-center"
                                    />

                                    {/* Content */}
                                    <div className="ml-4 flex flex-1 items-center justify-between">
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                {getAmenityIcon(service.service_name)}
                                                <Label 
                                                    htmlFor={`service-${service.service_id}`} 
                                                    className="font-semibold text-slate-900 text-lg cursor-pointer"
                                                >
                                                    {service.service_name}
                                                </Label>
                                            </div>

                                            <p className="text-sm text-slate-500 leading-snug pr-4">
                                                {service.description}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-lg text-blue-600 font-bold">${service.price}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>


            {/* Special Requests */}
            <Card>
                <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Any special requests or requirements? (Optional)"
                        rows={4}
                        value={bookingData.specialRequest}
                        onChange={(e) => onBookingChange({ specialRequest: e.target.value })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}