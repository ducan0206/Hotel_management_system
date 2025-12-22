import { useState, useEffect } from "react";
import { RoomCard } from "../component/RoomCard";
import { RoomFilters } from "../component/RoomFilter";
import { LayoutGrid, List, BedSingle } from "lucide-react";
import { getAvailableRooms } from "../../apis/APIFunction";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useRooms } from "../../context/RoomContext";

const RoomsPage = () => {
    const { rooms } = useRooms();

    const [filteredRooms, setFilteredRooms] = useState(rooms);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const location = useLocation();

    useEffect(() => {
        setFilteredRooms(rooms);
    }, [rooms]);

    useEffect(() => {
        const loadAvailableRooms = async () => {
            const queryParams = new URLSearchParams(location.search);
            const checkIn = queryParams.get("checkIn");
            const checkOut = queryParams.get("checkOut");
            const capacity = queryParams.get("capacity");

            if (!checkIn || !checkOut || !capacity) return;

            try {
                const res = await getAvailableRooms(
                    checkIn,
                    checkOut,
                    Number(capacity)
                );

                if (res.status === 200) {
                    setFilteredRooms(res.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Could not load available rooms");
            }
        };

        loadAvailableRooms();
    }, [location.search]);

    return (
        <div className="min-h-screen bg-gray-50 mt-16">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                                <BedSingle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-900 text-xl">All Rooms</p>
                                <p className="text-sm text-gray-500">
                                    Summary: {filteredRooms.length} rooms
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${
                                viewMode === "grid"
                                    ? "bg-cyan-100 text-cyan-600"
                                    : "text-gray-400"
                                }`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${
                                viewMode === "list"
                                    ? "bg-cyan-100 text-cyan-600"
                                    : "text-gray-400"
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters */}
                    <aside className="lg:w-64">
                        <RoomFilters
                            rooms={rooms}
                            onFilterChange={setFilteredRooms}
                        />
                    </aside>

                    {/* Room List */}
                    <main className="flex-1">
                        {filteredRooms.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Not found.
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
};

export default RoomsPage;
