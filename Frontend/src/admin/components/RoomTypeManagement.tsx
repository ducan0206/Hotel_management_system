import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useRooms } from '../../context/RoomContext';
import { toast } from 'sonner';

export function RoomTypeManagement() {
    const { roomTypes, addRoomType, updateRoomType, deleteRoomType } = useRooms();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoomType, setEditingRoomType] = useState<any>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        capacity: 0,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            capacity: 0,
        });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.capacity) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const roomTypeData = {
            type_name: formData.name,
            capacity: formData.capacity,
        };

        if (isEditDialogOpen && editingRoomType) {
            console.log(editingRoomType);
            console.log(editingRoomType.type_id);
            updateRoomType(Number(editingRoomType.type_id), roomTypeData);
            toast.success('Room type updated successfully!');
            setIsEditDialogOpen(false);
        } else {
            addRoomType(roomTypeData);
            toast.success('New room type added successfully!');
            setIsAddDialogOpen(false);
        }

        resetForm();
        setEditingRoomType(null);
    };

    const handleEdit = (roomType: any) => {
        setEditingRoomType(roomType);
        setFormData({
            name: roomType.name,
            capacity: roomType.capacity
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this room type?')) {
            deleteRoomType(id);
            toast.success('Room type deleted successfully!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-3xl">Room Type Management</h2>
                <p className="text-gray-500">Manage room types in the hotel</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => resetForm()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Room Type
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                    <DialogTitle>Add New Room Type</DialogTitle>
                    <DialogDescription>
                        Enter detailed information for the new room type
                    </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Room Type Name*</Label>
                            <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Deluxe Room"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                placeholder="2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Add Room Type</Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Room Type</DialogTitle>
                            <DialogDescription>
                                Update room type information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Room Type Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Deluxe Room"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-capacity">Capacity *</Label>
                                <Input
                                    id="edit-capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    placeholder="2"
                                />
                            </div>

                        </div>
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
                    <CardTitle>List of Room Types</CardTitle>
                    <CardDescription>
                        Total of {roomTypes?.length} room types
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roomTypes?.map((roomType) => (
                                <TableRow key={roomType.type_id}>
                                    <TableCell>{roomType.type_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span>{roomType.capacity} people</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(roomType)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(Number(roomType.type_id))}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
