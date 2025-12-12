import { Card, CardContent } from "../../ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

export function StatCard({ title, value, change, icon, trend = "up" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-gray-600">{title}</p>
            <p className="text-3xl">{value}</p>
            <div className="flex items-center gap-1 text-sm">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
