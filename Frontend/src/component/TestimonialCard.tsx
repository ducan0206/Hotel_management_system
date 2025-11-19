import { Card, CardContent } from "../ui/card.tsx";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar.tsx";

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export function TestimonialCard({ name, rating, comment, date }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p>{name}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        <div className="flex gap-1 mb-3">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-600">{comment}</p>
      </CardContent>
    </Card>
  );
}
