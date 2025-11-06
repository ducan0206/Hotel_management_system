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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    )

    // return (
    //     <section className="bg-light mb-5 mt-5 shadow">
    //     <Container>
    //         <Carousel indicators={false}>
    //         {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
    //             <Carousel.Item key={index}>
    //             <Row>
    //                 {rooms.slice(index * 4, index * 4 + 4).map((room) => (
    //                 <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
    //                     <Card className="shadow-sm border-0 rounded-4">
    //                     <Card.Img
    //                         variant="top"
    //                         src={room.image_url}
    //                         alt={room.type_name}
    //                         style={{ height: "200px", objectFit: "cover" }}
    //                     />
    //                     <Card.Body>
    //                         <Card.Title className="fw-bold">{room.type_name}</Card.Title>
    //                         <Card.Text>{room.description}</Card.Text>
    //                         <Card.Text>
    //                         <strong>${room.price}</strong> / night
    //                         </Card.Text>
    //                         <Button variant="dark" className="w-100 rounded-3">
    //                             Book Now
    //                         </Button>
    //                     </Card.Body>
    //                     </Card>
    //                 </Col>
    //                 ))}
    //             </Row>
    //             </Carousel.Item>
    //         ))}
    //         </Carousel>
    //     </Container>
    //     </section>
    // )
}

export default RoomCarousel
