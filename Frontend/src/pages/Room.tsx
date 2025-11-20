import { useState, useEffect } from "react";
import { RoomCard } from "../component/RoomCard";
import { RoomFilters } from "../component/RoomFilter.tsx";
import { LayoutGrid, List, BedSingle } from "lucide-react";
import { getAvailableRooms, fetchRooms } from "../utils/APIFunction.ts";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface Room {
  room_id: string;
  room_number: string;
  type_name: string;
  capacity: number;
  price: number;
  status: string;
  description: string;
  image_url: string;
  area: number;
  standard: string;
  floor: number;
  services: string[];
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      const queryParams = new URLSearchParams(location.search);
      const check_in = queryParams.get("checkIn");
      const check_out = queryParams.get("checkOut");
      const guests = queryParams.get("capacity");
      if(!check_in || !check_out || !guests) {
        const data = await fetchRooms();
        setRooms(data);
        setFilteredRooms(data);
        console.log("Missing search parameters, displaying empty list.");
        return;
      }

      try {
        const response = await getAvailableRooms(check_in, check_out, parseInt(guests));
                
        if (response.status === 200) {
          console.log(1);
          setRooms(response.data);
          setFilteredRooms(response.data);
        } else if (response.status === 404) {
          const data = await fetchRooms();
          setRooms(data);
          setFilteredRooms(data);
        }
      } catch (error) {
        console.error("Error fetching available rooms:", error);
        toast.error("Could not load rooms."); 
      }
    };
    loadRooms();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <BedSingle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900 text-4l">All Rooms</p>
                <p className="text-sm text-gray-500">
                  Summary: {filteredRooms.length} rooms
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-cyan-100 text-cyan-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-cyan-100 text-cyan-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <RoomFilters
              rooms={rooms}
              onFilterChange={setFilteredRooms}
            />
          </aside>

          {/* Rooms Grid/List */}
          <main className="flex-1">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Not found.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.room_id}
                    room={room}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;