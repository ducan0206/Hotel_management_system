import { useState, useEffect } from "react";
import { RoomCard } from "../component/RoomCard";
import { RoomFilters } from "../component/RoomFilter.tsx";
import { LayoutGrid, List, BedSingle } from "lucide-react";
import { fetchRooms } from "../utils/APIFunction.ts";

// export interface Room {
//   id: string;
//   type: string;
//   standard: string;
//   price: number;
//   capacity: number;
//   status: string;
//   image: string;
//   amenities: string[];
//   floor: number;
//   area: number;
// }

// const mockRooms: Room[] = [
//   {
//     id: "101",
//     name: "Deluxe Ocean View",
//     type: "deluxe",
//     price: 250,
//     capacity: 2,
//     status: "available",
//     image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "Ocean View", "Balcony"],
//     floor: 1,
//     size: 35,
//   },
//   {
//     id: "102",
//     name: "Executive Suite",
//     type: "suite",
//     price: 450,
//     capacity: 4,
//     status: "available",
//     image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "Kitchen", "Living Room", "City View"],
//     floor: 1,
//     size: 60,
//   },
//   {
//     id: "201",
//     name: "Standard Room",
//     type: "standard",
//     price: 150,
//     capacity: 2,
//     status: "occupied",
//     image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar"],
//     floor: 2,
//     size: 25,
//   },
//   {
//     id: "202",
//     name: "Premium Suite",
//     type: "suite",
//     price: 500,
//     capacity: 4,
//     status: "available",
//     image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "Jacuzzi", "Ocean View", "Balcony"],
//     floor: 2,
//     size: 70,
//   },
//   {
//     id: "301",
//     name: "Deluxe Room",
//     type: "deluxe",
//     price: 280,
//     capacity: 3,
//     status: "available",
//     image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "City View"],
//     floor: 3,
//     size: 40,
//   },
//   {
//     id: "302",
//     name: "Standard Plus",
//     type: "standard",
//     price: 180,
//     capacity: 2,
//     status: "maintenance",
//     image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "Work Desk"],
//     floor: 3,
//     size: 28,
//   },
//   {
//     id: "401",
//     name: "Royal Suite",
//     type: "suite",
//     price: 800,
//     capacity: 6,
//     status: "available",
//     image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "Kitchen", "Living Room", "Dining Room", "Ocean View", "Balcony"],
//     floor: 4,
//     size: 100,
//   },
//   {
//     id: "402",
//     name: "Deluxe King",
//     type: "deluxe",
//     price: 300,
//     capacity: 2,
//     status: "occupied",
//     image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
//     amenities: ["WiFi", "TV", "Mini Bar", "King Bed", "City View"],
//     floor: 4,
//     size: 38,
//   },
// ];

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

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } 
    };
    loadRooms();
    console.log(rooms);
  }, []);

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