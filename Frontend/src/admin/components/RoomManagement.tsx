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
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useRooms } from '../../context/RoomContext';
import { toast } from 'sonner';

export function RoomManagement() {
    const { rooms, roomTypes, addRoom, updateRoom, deleteRoom, getRoomType } = useRooms();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const [formData, setFormData] = useState({
        room_type: '',
        room_number: '',
        price: 0,
        status: '',
        description: '',
        image_url: null as File | null,
        area: 0,
        standard: '',
        floor: 0,
        services: [],
        created_at: ''
    });

    const resetForm = () => {
        setFormData({
            room_type: '',
            room_number: '',
            price: 0,
            status: '',
            description: '',
            image_url: null as File | null,
            area: 0,
            standard: '',
            floor: 0,
            services: [],
            created_at: ''
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];
        if (files) {
            setFormData({
                ...formData,
                image_url: files
            });
            toast.success(`The image ${files.name} has been uploaded successfully!`);
        }
    };

    const handleSubmit = () => {
        if (!formData.room_number || !formData.room_type || !formData.floor) {
            toast.error('Please fill in all required fields.');
            return;
        }

        // Check if room number already exists (except when editing the same room)
        const roomNumberExists = rooms.some(r => 
            r.room_number === formData.room_number && (!editingRoom || r.room_id !== editingRoom.id)
        );
        
        if (roomNumberExists) {
            toast.error('Room number already exists!');
            return;
        }

        const roomData = {
            room_number: formData.room_number,
            room_type: formData.room_type,
            floor: formData.floor,
            status: formData.status,
            images: formData.image_url ? [formData.image_url] : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'],
            notes: formData.description  || undefined
        };

        if (isEditDialogOpen && editingRoom) {
            //updateRoom(editingRoom.id, roomData);
            toast.success('C?p nh?t phòng thành công!');
            setIsEditDialogOpen(false);
        } else {
            addRoom(roomData);
            toast.success('Thêm phòng m?i thành công!');
            setIsAddDialogOpen(false);
        }

        resetForm();
        setEditingRoom(null);
    };

    const handleEdit = (room: any) => {
        setEditingRoom(room);

        setFormData({
            room_number: room.room_number,
            room_type: room.type_name,     
            floor: room.floor?.toString() ?? '',
            status: room.status ?? 'available',
            description: room.description ?? '',
            price: room.price ?? 0,
            area: room.area ?? 0,
            standard: room.standard ?? '',
            services: room.services ?? [],
            image_url: null,
            created_at: room.created_at ?? '',
        });

        setIsEditDialogOpen(true);
    };
    const handleDelete = (id: string) => {
        if (confirm('B?n có ch?c ch?n mu?n xóa phòng này?')) {
            deleteRoom(id);
            toast.success('Xóa phòng thành công!');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            available: { label: 'Tr?ng', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
            occupied: { label: '?ang ?', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
            maintenance: { label: 'B?o trì', variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
            reserved: { label: '?ã ??t', variant: 'default' as const, className: 'bg-purple-100 text-purple-800' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const renderRoomDialog = (isEdit: boolean) => (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-roomNumber' : 'roomNumber'}>S? phòng *</Label>
                    <Input
                        id={isEdit ? 'edit-roomNumber' : 'roomNumber'}
                        value={formData.room_number}
                        onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                        placeholder="VD: 101"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-floor' : 'floor'}>T?ng *</Label>
                    <Input
                        id={isEdit ? 'edit-floor' : 'floor'}
                        type="number"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                        placeholder="1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-roomType' : 'roomType'}>Lo?i phòng *</Label>
                <Select value={formData.room_type} onValueChange={(value) => setFormData({ ...formData, room_type: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ch?n lo?i phòng" />
                    </SelectTrigger>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-status' : 'status'}>Tr?ng thái *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ch?n tr?ng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Tr?ng</SelectItem>
                        <SelectItem value="occupied">?ang ?</SelectItem>
                        <SelectItem value="maintenance">B?o trì</SelectItem>
                        <SelectItem value="reserved">?ã ??t</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Hình ?nh phòng</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload hình ?nh
                    </Button>
                    
                </div>
                <p className="text-sm text-gray-500">
                    B?n có th? upload nhi?u hình ?nh. N?u không upload, h? th?ng s? s? d?ng hình ?nh m?c ??nh.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-notes' : 'notes'}>Ghi chú</Label>
                <Textarea
                    id={isEdit ? 'edit-notes' : 'notes'}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ghi chú v? phòng (n?u có)..."
                    rows={3}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl">Qu?n lý phòng</h2>
                    <p className="text-gray-500">Qu?n lý các phòng trong khách s?n</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                        <Plus className="h-4 w-4 mr-2" />
                            Thêm phòng m?i
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Thêm phòng m?i</DialogTitle>
                            <DialogDescription>
                                Nh?p thông tin chi ti?t cho phòng m?i
                            </DialogDescription>
                        </DialogHeader>
                        {renderRoomDialog(false)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                H?y
                            </Button>
                            <Button onClick={handleSubmit}>Thêm phòng</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Ch?nh s?a phòng</DialogTitle>
                            <DialogDescription>
                                C?p nh?t thông tin phòng
                            </DialogDescription>
                        </DialogHeader>
                        {renderRoomDialog(true)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                H?y
                            </Button>
                            <Button onClick={handleSubmit}>C?p nh?t</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List of rooms</CardTitle>
                    <CardDescription>
                        T?ng s? {rooms.length} phòng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S? phòng</TableHead>
                                <TableHead>Lo?i phòng</TableHead>
                                <TableHead>T?ng</TableHead>
                                <TableHead>Tr?ng thái</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Hình ?nh</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.map((room) => {
                                const roomType = getRoomType();
                                return (
                                <TableRow key={room.id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{roomType?.type_name || 'N/A'}</TableCell>
                                    <TableCell>T?ng {room.floor}</TableCell>
                                    <TableCell>{getStatusBadge(room.status)}</TableCell>
                                    <TableCell>{roomType ? formatPrice(roomType.base_price) : 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{room.images.length} ?nh</span>
                                        </div>
                                    </TableCell>
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
                                                onClick={() => handleDelete(room.room_id)}
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
