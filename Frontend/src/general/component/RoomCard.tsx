import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card.tsx";
import { Badge } from "../../ui/badge.tsx";
import { Button } from "../../ui/button.tsx";
import type { Room } from "../pages/Room.tsx";
import { ImageWithFallback } from "../utils/ImageWithFallback.tsx";
import { Users,Maximize, Layers, Wifi, Tv, Wine, Eye, Edit, Trash2, Utensils, } from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RoomCardProps {
    room: Room;
    viewMode: "grid" | "list";
}

export function RoomCard({ room, viewMode }: RoomCardProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    /** ? FIX: ??m b?o services luôn là m?ng */
    const services: string[] = Array.isArray(room.services) ? room.services : [];

    useEffect(() => {
        setIsAdmin(!!user && user.role !== "customer");
    }, [user]);

    const getStatusBadge = (status: Room["status"]) => {
        switch (status) {
            case "available":
                return <Badge className="bg-green-500">Available</Badge>;
            case "booked":
                return <Badge className="bg-red-500">Occupied</Badge>;
            case "maintenance":
                return <Badge className="bg-yellow-500">Maintenance</Badge>;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type.toLowerCase()) {
            case "standard":
                return "Standard";
            case "deluxe":
                return "Deluxe";
            case "suite":
                return "Suite";
            default:
                return type;
        }
    };

  /** Icon theo service */
    const getAmenityIcon = (amenity: string) => {
        const lower = amenity.toLowerCase();
        if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
        if (lower.includes("tv")) return <Tv className="w-4 h-4" />;
        if (lower.includes("bar")) return <Wine className="w-4 h-4" />;
        if (lower.includes("breakfast")) return <Utensils className="w-4 h-4" />;
        return null;
    };

    const handleBooking = () => {
        if (room.status !== "available") {
            toast.error("This room is unavailable now.");
            return;
        }
        navigate(`/booking/${room.room_id}`, {
            state: { selectedRoom: room },
        });
    };

  /* ================= LIST VIEW ================= */
    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-48 relative">
                        <ImageWithFallback
                            src={room.image_url}
                            alt={room.type_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                            {getStatusBadge(room.status)}
                        </div>
                    </div>

                    <CardContent className="flex-1 p-6">
                        <h3 className="text-lg font-semibold">
                            Room {room.room_number}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            {room.type_name}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {room.capacity} people
                            </div>
                            <div className="flex items-center gap-1">
                                <Maximize className="w-4 h-4" /> {room.area} m²
                            </div>
                            <div className="flex items-center gap-1">
                                <Layers className="w-4 h-4" /> Floor {room.floor}
                            </div>
                            <Badge variant="outline">
                                {getTypeLabel(room.standard)}
                            </Badge>
                        </div>

                        {/* ? Services + icons */}
                        {services.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {services.slice(0, 5).map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                                >
                                    {getAmenityIcon(s)}
                                    <span>{s}</span>
                                </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <p className="text-2xl text-cyan-600">${room.price}</p>
                                <p className="text-xs text-gray-500">per night</p>
                            </div>

                            {isAdmin ? (
                                <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleBooking}
                                    className="hover:bg-cyan-600 hover:text-white"
                                >
                                Book Now
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>
        );
    }

  /* ================= GRID VIEW ================= */
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <ImageWithFallback
                    src={room.image_url}
                    alt={room.type_name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                    {getStatusBadge(room.status)}
                </div>
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary">
                        {getTypeLabel(room.standard)}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold">Room {room.room_number}</h3>
                <p className="text-sm text-gray-600 mb-3">
                    {room.type_name}
                </p>

                <div className="flex gap-3 text-sm text-gray-600 mb-3">
                    <Users className="w-4 h-4" /> {room.capacity}
                    <Maximize className="w-4 h-4" /> {room.area}m²
                </div>

                {services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {services.slice(0, 3).map((s, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                            {getAmenityIcon(s)}
                            <span>{s}</span>
                        </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center border-t pt-3">
                    <div>
                        <p className="text-xl text-cyan-600">${room.price}</p>
                        <p className="text-xs text-gray-500">per night</p>
                    </div>

                    {!isAdmin && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleBooking}
                            className="hover:bg-cyan-600 hover:text-white"
                        >
                        Book Now
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
