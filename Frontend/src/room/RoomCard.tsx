import { Card, CardContent } from '../component/ui/card.tsx';
import { Button } from '../component/ui/button.tsx';
import { Users, Maximize } from "lucide-react";
import { ImageWithFallback } from "../helper/ImageWithFallback.tsx";

interface RoomCardProps {
    name: string;
    image: string;
    price: string;
    capacity: string;
    description: string;
}

export function RoomCard({ name, image, price, capacity, description }: RoomCardProps) {

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-shadow w-full h-auto max-w-sm">
            <div className="relative h-64">
                <ImageWithFallback
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    {price}<span className="text-sm">/night</span>
                </div>
            </div>
            <CardContent className="p-6">
                <h3 className="text-2xl mb-2">{name}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="flex items-center gap-6 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Maximize className="h-4 w-4" />
                    </div>
                </div>
                <Button className="w-full cursor-pointer">View Details</Button>
            </CardContent>
        </Card>
    );
}