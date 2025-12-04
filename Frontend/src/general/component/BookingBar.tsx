import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookingBar() {
  const[checkIn, setCheckIn] = useState('');
  const[checkOut, setCheckOut] = useState('');
  const[guests, setGuests] = useState(1);

  const navigate = useNavigate();

  function handleCheck() {
    if(!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
    const queryParams = new URLSearchParams({
      checkIn,
      checkOut,
      capacity: guests.toString()
    }).toString();
    navigate(`/all-rooms?${queryParams}`);
  }

  return (
    <div className="relative z-20 -mt-20 mb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="date" 
                    className="pl-10"
                    defaultValue="2025-11-10"
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="date" 
                    className="pl-10"
                    defaultValue="2025-11-15"
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />    
                  <select className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={(e) => setGuests(parseInt(e.target.value))}>
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={() => handleCheck()} className="w-full h-10">
                  Check Availability
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
