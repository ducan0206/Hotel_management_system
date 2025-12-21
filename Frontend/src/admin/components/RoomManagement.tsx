import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useRooms } from '../../context/RoomContext';
import { toast } from 'sonner';

type RoomStatus = 'available' | 'booked' | 'reserved';
type RoomStandard = 'Deluxe' | 'Suite' | 'Standard';

export function RoomManagement() {
    const { rooms, roomTypes, addRoom, updateRoom, deleteRoom, getRoomTypeById } = useRooms();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const [formData, setFormData] = useState<{
        room_number: string;
        room_type: string;
        price: number;
        status: RoomStatus;   // ?? QUAN TR?NG
        description: string;
        image: File | null;
        area: number;
        standard: RoomStandard;
        floor: number;
        services: string[];
    }>({
        room_number: "",
        room_type: "",
        price: 0,
        status: "available", // ?? literal h?p l?
        description: "",
        image: null,
        area: 0,
        standard: "Standard",
        floor: 0,
        services: [],
    });

    const resetForm = () => {
        setFormData({
            room_type: '',
            room_number: '',
            price: 0,
            status: 'available',
            description: '',
            image: null as File | null,
            area: 0,
            standard: 'Standard',
            floor: 0,
            services: [],
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            toast.success(`Uploaded ${file.name}`);
        }
    };

    const handleSubmit = async () => {
        if (!formData.room_number || !formData.room_type || !formData.floor) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const roomNumberExists = rooms.some(r =>
            r.room_number === formData.room_number &&
            (!editingRoom || r.room_id !== editingRoom.room_id)
        );

        if (roomNumberExists) {
            toast.error('Room number already exists!');
            return;
        }

        const payload = {
            room_number: formData.room_number,
            room_type: formData.room_type,
            price: formData.price,
            status: formData.status,
            description: formData.description,
            area: formData.area,
            standard: formData.standard,
            floor: formData.floor,
            services: formData.services,
            image: formData.image, // ?? File
        };

        try {
            if (isEditDialogOpen && editingRoom) {
                toast.success('Update room successfully!');
                setIsEditDialogOpen(false);
            } else {
                await addRoom(payload);
                toast.success('Add room successfully!');
                setIsAddDialogOpen(false);
            }
            resetForm();
            setEditingRoom(null);
        } catch {
            toast.error('Operation failed!');
        }
    };


    const handleEdit = (room: any) => {
        setEditingRoom(room);
        setFormData({
            room_number: room.room_number,
            room_type: room.type_name,  
            price: room.price,
            status: room.status,
            description: room.description ?? '',
            area: room.area ?? 0,
            standard: room.standard ?? 'Standard',
            floor: room.floor ?? 0,
            services: room.services ?? [],
            image: null,
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this room?')) {
            deleteRoom(id);
            toast.success('Delete room successfully!');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            available: { label: 'Empty', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
            booked: { label: 'Occupied', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
            maintenance: { label: 'Maintenance', variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const renderRoomDialog = (isEdit: boolean) => (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-roomNumber' : 'roomNumber'}>Room Number *</Label>
                    <Input
                        id={isEdit ? 'edit-roomNumber' : 'roomNumber'}
                        value={formData.room_number}
                        onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                        placeholder="VD: 101"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-floor' : 'floor'}>Floor *</Label>
                    <Input
                        id={isEdit ? 'edit-floor' : 'floor'}
                        type="number"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                        placeholder="1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-price' : 'price'}>Price ($) *</Label>
                    <Input
                        id={isEdit ? 'edit-price' : 'price'}
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="1000000"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-area' : 'area'}>Area (m<sup>2</sup>) *</Label>
                    <Input
                        id={isEdit ? 'edit-area' : 'area'}
                        type="number"
                        value={formData.area}   
                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                        placeholder="30"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-roomType' : 'roomType'}>Room Type *</Label>
                <Select
                    value={formData.room_type}
                    onValueChange={(value) =>
                        setFormData({ ...formData, room_type: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                        {roomTypes.map(rt => (
                            <SelectItem key={rt.type_id} value={rt.type_name}>
                                {rt.type_name} ({rt.capacity})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-status' : 'status'}>Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-standard' : 'standard'}>Standard *</Label>
                <Select value={formData.standard} onValueChange={(value: any) => setFormData({ ...formData, standard: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select standard" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Room Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload images
                    </Button>
                    
                </div>
                <p className="text-sm text-gray-500">
                    You can upload multiple images for the room.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-notes' : 'notes'}>Description</Label>
                <Textarea
                    id={isEdit ? 'edit-notes' : 'notes'}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description about the room (if any)..."
                    rows={3}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl">Room Management</h2>
                    <p className="text-gray-500">Manage rooms in the hotel</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                        <Plus className="h-4 w-4 mr-2" />
                            Add New Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Room</DialogTitle>
                            <DialogDescription>
                                Enter detailed information for the new room
                            </DialogDescription>
                        </DialogHeader>
                        {renderRoomDialog(false)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Add Room</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Room</DialogTitle>
                            <DialogDescription>
                                Update room information
                            </DialogDescription>
                        </DialogHeader>
                        {renderRoomDialog(true)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List of rooms</CardTitle>
                    <CardDescription>
                        Total rooms: {rooms.length}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Number</TableHead>
                                <TableHead>Room Type</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.map((room) => {
                                const roomType = getRoomTypeById(room.room_type);
                                return (
                                <TableRow key={room.room_id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{roomType?.type_name || 'N/A'}</TableCell>
                                    <TableCell>Floor {room.floor}</TableCell>
                                    <TableCell>{getStatusBadge(room.status)}</TableCell>
                                    <TableCell>{room ? formatPrice(room.price) : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(room)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(Number(room.room_id))}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
