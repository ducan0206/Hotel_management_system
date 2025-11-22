import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator.tsx";
import type { BookingData } from "../pages/Booking.tsx";
import { ImageWithFallback } from "../helper/ImageWithFallback";
import { CalendarIcon, Users, MapPin, Wifi, Tv, Wine } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface BookingSummaryProps {
  bookingData: BookingData;
  onProceedToPayment: () => void;
}

export function BookingSummary({ bookingData, onProceedToPayment }: BookingSummaryProps) {
  const { room, checkIn, checkOut, guests } = bookingData;

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const subtotal = nights * room.price;
  const tax = subtotal * 0.1; // 10% tax
  const serviceFee = 25;
  const total = subtotal + tax + serviceFee;

  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Image and Info */}
          <div className="space-y-3">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={room.image_url}
                alt={room.standard}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-gray-900">Room {room.room_id}</h3>
              <p className="text-sm text-gray-600">{room.type_name}</p>
              <Badge variant="secondary" className="mt-2">
                {room.standard === "Standard" && "Standard"}
                {room.standard === "Deluxe" && "Deluxe"}
                {room.standard === "Suite" && "Suite"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Check-in - Check-out</p>
                <p className="text-gray-900">
                  {checkIn && checkOut ? (
                    <>
                      {format(checkIn, "MMM dd, yyyy")} -{" "}
                      {format(checkOut, "MMM dd, yyyy")}
                    </>
                  ) : (
                    <span className="text-gray-400">Not selected</span>
                  )}
                </p>
                {nights > 0 && (
                  <p className="text-sm text-gray-600">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Guests</p>
                <p className="text-gray-900">
                  {guests.adults} {guests.adults === 1 ? 'Adult' : 'Adults'}
                  {guests.children > 0 && `, ${guests.children} ${guests.children === 1 ? 'Child' : 'Children'}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Amenities</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["WiFi", "TV", "Mini Bar"].map((amenity, index) => {
                    const getIcon = () => {
                      if (amenity === "WiFi") return <Wifi className="w-3 h-3" />;
                      if (amenity === "TV") return <Tv className="w-3 h-3" />;
                      if (amenity === "Mini Bar") return <Wine className="w-3 h-3" />;
                      return null;
                    };
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        {getIcon()}
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                ${room.price} x {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service fee</span>
              <span className="text-gray-900">${serviceFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-gray-900">Total</span>
              <span className="text-xl text-cyan-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
            size="lg"
            onClick={onProceedToPayment}
            disabled={!checkIn || !checkOut || nights === 0}
          >
            Proceed to Payment
          </Button>

          <p className="text-xs text-gray-500 text-center">
            You won't be charged yet
          </p>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>? Free cancellation within 24 hours</p>
          <p>? 50% refund if canceled after 24 hours</p>
          <p>? No refund if canceled within 48 hours of check-in</p>
        </CardContent>
      </Card>
    </div>
  );
}