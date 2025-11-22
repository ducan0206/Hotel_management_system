import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import type { BookingData } from "../pages/Booking.tsx";
import { CalendarIcon, User, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

interface BookingFormProps {
  bookingData: BookingData;
  onBookingChange: (updates: Partial<BookingData>) => void;
}

export function BookingForm({ bookingData, onBookingChange }: BookingFormProps) {
  const handleGuestInfoChange = (field: string, value: string) => {
    onBookingChange({
      guestInfo: {
        ...bookingData.guestInfo,
        [field]: value,
      },
    });
  };

  const handleGuestsChange = (field: "adults" | "children", value: number) => {
    onBookingChange({
      guests: {
        ...bookingData.guests,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
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
              <Popover>
                <PopoverTrigger>
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingData.checkIn ? (
                        format(bookingData.checkIn, "MMM dd, yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingData.checkIn}
                    onSelect={(date) => onBookingChange({ checkIn: date })}
                    disabled={(date) =>
                      date < new Date() || (bookingData.checkOut ? date >= bookingData.checkOut : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger>
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingData.checkOut ? (
                        format(bookingData.checkOut, "MMM dd, yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingData.checkOut}
                    onSelect={(date) => onBookingChange({ checkOut: date })}
                    disabled={(date) =>
                      date < new Date() || (bookingData.checkIn ? date <= bookingData.checkIn : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adults */}
            <div className="space-y-2">
              <Label htmlFor="adults">Adults</Label>
              <Select
                value={bookingData.guests.adults.toString()}
                onValueChange={(value) => handleGuestsChange("adults", parseInt(value))}
              >
                <SelectTrigger id="adults">
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

            {/* Children */}
            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Select
                value={bookingData.guests.children.toString()}
                onValueChange={(value) => handleGuestsChange("children", parseInt(value))}
              >
                <SelectTrigger id="children">
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
        </CardContent>
      </Card>

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
                <Input
                  id="firstName"
                  placeholder="John"
                  className="pl-10"
                  value={bookingData.guestInfo.firstName}
                  onChange={(e) => handleGuestInfoChange("firstName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="pl-10"
                  value={bookingData.guestInfo.lastName}
                  onChange={(e) => handleGuestInfoChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="pl-10"
                  value={bookingData.guestInfo.email}
                  onChange={(e) => handleGuestInfoChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="pl-10"
                  value={bookingData.guestInfo.phone}
                  onChange={(e) => handleGuestInfoChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                id="address"
                placeholder="Street address"
                className="pl-10"
                value={bookingData.guestInfo.address}
                onChange={(e) => handleGuestInfoChange("address", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={bookingData.guestInfo.city}
                onChange={(e) => handleGuestInfoChange("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={bookingData.guestInfo.country}
                onChange={(e) => handleGuestInfoChange("country", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={bookingData.guestInfo.zipCode}
                onChange={(e) => handleGuestInfoChange("zipCode", e.target.value)}
              />
            </div>
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
            value={bookingData.specialRequests}
            onChange={(e) => onBookingChange({ specialRequests: e.target.value })}
          />
        </CardContent>
      </Card>
    </div>
  );
}