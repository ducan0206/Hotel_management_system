import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from "../ui/button";
import { ImageWithFallback } from "../helper/ImageWithFallback"
import { Users, Maximize, Wifi, Tv, Coffee, Wind, Bath, Wine, Utensils } from "lucide-react";

interface RoomDetails {
    id: string;
    room_number: string;
    type_name: string;
    capacity: number;
    price: number;
    description: string;
    image_url: string;
    area: number;
    floor: number;
    standard: string;
    services: string[];
}

interface RoomDetailDialogProps {
    room: RoomDetails | null,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

const RoomDetailDialog: React.FC<RoomDetailDialogProps> = ({room, open, onOpenChange}) => {

    const amenityIcons: Record<string, React.FC<{ className?: string }>> = {
        "Free WiFi": Wifi,
        "Smart TV": Tv,
        "Coffee Maker": Coffee,
        "Air Conditioning": Wind,
        "Private Bathroom": Bath,
        "Mini Bar": Wine,
        "Breakfast": Utensils
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle className="text-3xl">{room?.standard}</DialogTitle>
                <DialogDescription>
                    Complete room details and booking information
                </DialogDescription>
                </DialogHeader>

                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback
                        src={room?.image_url}
                        alt={`${room?.standard}`}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                        {room?.price}<span className="text-sm">/night</span>
                    </div>
                </div>

                {/* Room Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                    <div>
                        <p className="text-gray-600 text-sm">Room Size</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Maximize className="h-4 w-4 text-blue-600" />
                            <span>{room?.area}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Capacity</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>{room?.capacity}</span>
                        </div>
                    </div>
                <div>
                    <p className="text-gray-600 text-sm">Bed Type</p>
                    <p className="mt-1">{room?.type_name}</p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Max Guests</p>
                    <p className="mt-1">{room?.capacity} Guests</p>
                </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-xl mb-3">About This Room</h3>
                    <p className="text-gray-600 leading-relaxed">{room?.description}</p>
                </div>

                {/* Amenities */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room?.services?.map((amenity, index) => {
                        const Icon = amenityIcons[amenity] ?? Wifi;

                        return (
                        <div key={index} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{amenity}</span>
                        </div>
                        );
                    })}
                </div>

                {/* Policies */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="mb-3">Important Information</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li> Check-in: 12:00 PM | Check-out: 11:00 AM</li>
                            <li> Free cancellation up to 48 hours before check-in</li>
                            <li> Non-smoking room</li>
                            <li> Pets not allowed</li>
                        </ul>
                </div>

                {/* Booking Actions */}
                <div className="flex gap-3 pt-4">
                <Button className="flex-1" size="lg">
                    Book Now
                </Button>
                </div>
            </DialogContent>
        </Dialog>
        
    )
}

export default RoomDetailDialog