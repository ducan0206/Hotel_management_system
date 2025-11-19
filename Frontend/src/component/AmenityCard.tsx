import { Card, CardContent } from "../ui/card";

interface AmenityCardProps {
  icon: React.ReactNode;
  title: string;
}

export function AmenityCard({ icon, title }: AmenityCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          {icon}
        </div>
        <p className="text-sm">{title}</p>
      </CardContent>
    </Card>
  );
}
