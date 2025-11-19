import { useState, useEffect } from "react";
import { getAllRooms } from "../utils/APIFunction";
import { RoomCard } from "../room/RoomCard";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom"

interface IRoom {
    id: string;
    room_number: string;
    type_name: string;
    capacity: number;
    price: number;
    description: string;
    image_url: string;
}

const RoomCarousel = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getAllRooms().then((data) => setRooms(data));
    }, []);

    const next = () => {
        if (currentIndex < rooms.length - 3) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <section id="roomcarousel" className="py-20">
            <div className="grid justify-center items-center relative w-full">
                <div className="text-center mb-6 mt-10">
                    <h1>Our Rooms & Suites</h1>
                    <h2 className="text-gray-500">
                        Experience luxury and comfort in our rooms and suites.
                    </h2>
                </div>

                <button
                    onClick={prev}
                    className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full disabled:opacity-30 cursor-pointer"
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full disabled:opacity-30 cursor-pointer"
                    disabled={currentIndex >= rooms.length - 3}
                >
                    <ChevronRight size={20} />
                </button>

                {/* Sliding View */}
                <div className="flex justify-center gap-6 transition-all duration-300">
                    {rooms.slice(currentIndex, currentIndex + 3).map((room, i) => (
                        <RoomCard
                            key={i}
                            name={room.type_name}
                            image={room.image_url}
                            price={room.price.toString()}
                            capacity={room.capacity.toString()}
                            description={room.description}
                        />
                    ))}
                </div>

                <button onClick={() => navigate('/all-rooms')} className="mx-auto flex justify-center mt-10 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                    View All Rooms
                </button>
            </div>
        </section>
    );
};

export default RoomCarousel;
