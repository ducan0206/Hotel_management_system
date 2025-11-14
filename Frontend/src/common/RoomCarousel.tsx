import { useState, useEffect } from 'react'
import { getAllRooms } from '../utils/APIFunction'
import { RoomCard } from '../room/RoomCard.tsx'

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
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getAllRooms()
        .then((data: IRoom[]) => {
            setRooms(data)
            setIsLoading(false)
        })
        .catch((error: any) => {
            setErrorMessage(error.message)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) return <div className="mt-5 text-center">Loading rooms...</div>
    if (!isLoading && rooms.length === 0) return <div className="mt-5 text-center">No rooms found.</div>
    if (errorMessage) return <div className="text-danger mb-5 mt-5 text-center">Error: {errorMessage}</div>

    return (
        <div id="roomcarousel">
            <div className="grid gap-5">
                <h1 className="flex justify-center mt-10"> Our Rooms & Suites </h1>
                <h2 className="flex justify-center item-center mb-10 text-white-500"> Experience luxury and comfort in our carefully designed rooms and suites, each offering stunning views and premium amenities. </h2>
            </div>
            <div className="flex flex-wrap justify-center items-start gap-4">
                {rooms.map((room, index) => (
                    <RoomCard
                        key={index}
                        name={room.type_name}
                        image={room.image_url}
                        price={room.price.toString()}
                        capacity={room.capacity.toString()}
                        description={room.description}
                    />
                ))}
            </div>
        </div>
    )
}

export default RoomCarousel
