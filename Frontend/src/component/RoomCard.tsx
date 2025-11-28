import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Room } from "../pages/Room.tsx";
import { ImageWithFallback } from "../utils/ImageWithFallback.tsx";
import { Users, Maximize, Layers, Wifi, Tv, Wine, Eye, Edit, Trash2, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface RoomCardProps {
  room: Room;
  viewMode: "grid" | "list";
}

export function RoomCard({ room, viewMode }: RoomCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.role !== "customer") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const getStatusBadge = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "booked":
        return <Badge className="bg-red-500">Occupied</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintence</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
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

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lower.includes("tv")) return <Tv className="w-4 h-4" />;
    if (lower.includes("bar")) return <Wine className="w-4 h-4" />;
    if (lower.includes("breakfast")) return <Utensils className="w-4 h-4" />;
    return null;
  };

  const handleBooking = () => {
    if(room.status !== "available") {
      toast.error('This room is unavailable now.')
    } else {
      navigate(`/booking/${room.room_id}`, {state: {selectedRoom: room}})
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-48 h-48 sm:h-auto relative flex-shrink-0">
            <ImageWithFallback
              src={room.image_url}
              alt={room.type_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">{getStatusBadge(room.status)}</div>
          </div>
          
          <CardContent className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-gray-900 mb-1">Room {room.room_number}</h3>
                    <p className="text-sm text-gray-600">{room.type_name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} people</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{room.area}m<sup>2</sup></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    <span>Floor {room.floor}</span>
                  </div>
                  <div>
                    <Badge variant="outline">{getTypeLabel(room.standard)}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.services.slice(0, 5).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {room.services.length > 5 && (
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      +{room.services.length - 5} khác
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl text-cyan-600">${room.price}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
                
                {
                  isAdmin ? (
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="mt-5 hover:bg-cyan-600 hover:text-white transition-colors cursor-pointer" onClick={handleBooking}>
                        Book Now
                      </Button>
                    </div>
                  )
                }
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48">
        <ImageWithFallback
          src={room.image_url}
          alt={room.type_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">{getStatusBadge(room.status)}</div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">{getTypeLabel(room.standard)}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-gray-900 mb-1">Room {room.room_number}</h3>
          <p className="text-sm text-gray-600">{room.type_name}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{room.capacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{room.area}m<sup>2</sup></span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            <span>Floor {room.floor}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.services.slice(0, 3).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {room.services.length > 3 && (
            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              +{room.services.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-2xl text-cyan-600">${room.price}</p>
            <p className="text-xs text-gray-500">per night</p>
          </div>
          { isAdmin ? (
            <>
            <div className="flex gap-1">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            </>
          ) : (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="hover:bg-cyan-600 hover:text-white transition-colors cursor-pointer" onClick={handleBooking}>
                Book Now
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
