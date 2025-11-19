import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Room } from "../pages/Room.tsx";
import { Button } from "../ui/button.tsx";
import { RotateCcw } from "lucide-react";

interface RoomFiltersProps {
  rooms: Room[];
  onFilterChange: (filteredRooms: Room[]) => void;
}

export function RoomFilters({ rooms, onFilterChange }: RoomFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string>("all");

  const roomTypes = Array.from(new Set(rooms.map((r) => r.type)));
  const statuses = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
  ];

  useEffect(() => {
    let filtered = rooms;

    // Filter by price
    filtered = filtered.filter(
      (room) => room.price >= priceRange[0] && room.price <= priceRange[1]
    );

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((room) => selectedTypes.includes(room.type));
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((room) =>
        selectedStatuses.includes(room.status)
      );
    }

    // Filter by capacity
    if (selectedCapacity !== "all") {
      const capacity = parseInt(selectedCapacity);
      filtered = filtered.filter((room) => room.capacity >= capacity);
    }

    onFilterChange(filtered);
  }, [priceRange, selectedTypes, selectedStatuses, selectedCapacity, rooms, onFilterChange]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedCapacity("all");
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filter</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price ({priceRange[0]}$ - {priceRange[1]}$)</Label>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
        </div>

        {/* Room Type */}
        <div className="space-y-3">
          <Label>Room Type</Label>
          <div className="space-y-2">
            {roomTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm capitalize cursor-pointer"
                >
                  {type === "standard" && "Standard"}
                  {type === "deluxe" && "Deluxe"}
                  {type === "suite" && "Suite"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <Label>Status</Label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={selectedStatuses.includes(status.value)}
                  onCheckedChange={() => handleStatusToggle(status.value)}
                />
                <label
                  htmlFor={`status-${status.value}`}
                  className="text-sm cursor-pointer"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-3">
          <Label htmlFor="capacity">Capacity</Label>
          <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
            <SelectTrigger id="capacity">
              <SelectValue placeholder="Choose capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2">2 people</SelectItem>
              <SelectItem value="3">3 people</SelectItem>
              <SelectItem value="4">4 people</SelectItem>
              <SelectItem value="6">6 people</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
