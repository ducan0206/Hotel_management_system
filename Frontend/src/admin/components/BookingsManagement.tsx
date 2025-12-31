import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Plus, Pencil, Trash2, Search, Eye, Calendar, BedDouble } from 'lucide-react';
import { toast } from 'sonner';
import { useBooking, type BookingData } from '@/context/BookingContext';

interface BookingFormState {
    room_number: string;
    total_price: number | string;
    checkIn: string; 
    checkOut: string; 
    specialRequest: string;
    full_name: string;
    email: string;
    phone: string;
    id_card: string;
    address: string;
    adults: number;
    children: number;
}

export function BookingsManagement() {
    const { bookings, addBooking, updateBooking, deleteBooking } = useBooking();
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingBooking, setViewingBooking] = useState<any>(null); // ?? any ho?c BookingData
    const [editingId, setEditingId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const initialFormState: BookingFormState = {
        room_number: '',
        total_price: 0,
        checkIn: '',
        checkOut: '',
        specialRequest: '',
        full_name: '',
        email: '',
        phone: '',
        id_card: '',
        address: '',
        adults: 1,
        children: 0
    };

    const [formData, setFormData] = useState<BookingFormState>(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
    };

    const mapFormToContext = (form: BookingFormState): BookingData => {
        return {
            booking_id: editingId || 0, 
            user_id: 0, 
            checkIn: form.checkIn ? new Date(form.checkIn) : undefined,
            checkOut: form.checkOut ? new Date(form.checkOut) : undefined,
            specialRequest: form.specialRequest,
            additionalServices: [],
    
            room: { 
                room_id: 0,
                room_type: 0,       
                room_number: form.room_number,
                price: Number(form.total_price),
                status: 'available',
                description: '',
                image_url: '',
                area: 0,
                standard: 'Standard',
                floor: 0,  
                services: [],            
                created_at: '',
                updated_at: '',
                type_name: '',
                capacity: 0
            },

            guests: {
                adults: Number(form.adults),
                children: Number(form.children)
            },

            guestInfo: {
                fullName: form.full_name,
                email: form.email,
                phone: form.phone,
                idCard: form.id_card,
                address: form.address,
                dateOfBirth: '', 
                gender: 'male'
            }
        };
    };

    const mapContextToForm = (booking: any) => {
        setFormData({
            room_number: booking.room_number || '',
            total_price: booking.total_price || 0,
            checkIn: booking.check_in ? new Date(booking.check_in).toISOString().split('T')[0] : '',
            checkOut: booking.check_out ? new Date(booking.check_out).toISOString().split('T')[0] : '',
            specialRequest: booking.specialRequest || '',
            
            full_name: booking.full_name || '',
            email: booking.email || '',
            phone: booking.phone || '',
            id_card: booking.id_card || '',
            address: booking.address || '',
            
            adults: booking.adutls || booking.adults || 1,
            children: booking.children || 0
        });
    };

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.checkIn || !formData.checkOut) {
            toast.error('Please fill in Name and Dates!');
            return;
        }

        const payload = mapFormToContext(formData);

        try {
            if (isEditDialogOpen && editingId) {
                await updateBooking(editingId, payload);
                toast.success('Booking updated successfully!');
                setIsEditDialogOpen(false);
            } else {
                await addBooking(payload);
                toast.success('New booking created successfully!');
                setIsAddDialogOpen(false);
            }
            resetForm();
        } catch (error) {
            toast.error('Failed to save booking.');
        }
    };

    const handleEdit = (booking: any) => {
        setEditingId(booking.booking_id);
        mapContextToForm(booking); 
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this booking?')) {
            deleteBooking(id);
            toast.success('Deleted!');
        }
    };

    const handleViewDetails = (booking: any) => {
        setViewingBooking(booking);
        setIsViewDialogOpen(true);
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    const formatDateDisplay = (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

    const filteredBookings = bookings.filter(booking => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (booking.guestInfo?.fullName.toLowerCase() || '').includes(searchLower) ||
                              (booking.guestInfo?.phone || '').includes(searchLower) ||
                              String(booking.booking_id).includes(searchLower);
        return matchesSearch;
    });

    const renderBookingForm = () => (
        <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-2">
                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Check-in</Label>
                        <Input type="date" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Check-out</Label>
                        <Input type="date" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Room No.</Label>
                        <Input value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})} placeholder="101"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Total Price</Label>
                        <Input type="number" value={formData.total_price} onChange={(e) => setFormData({...formData, total_price: e.target.value})}/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 col-span-2 md:col-span-1">
                        <div className="space-y-2">
                            <Label>Adults</Label>
                            <Input type="number" min={1} value={formData.adults} onChange={(e) => setFormData({...formData, adults: Number(e.target.value)})}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Children</Label>
                            <Input type="number" min={0} value={formData.children} onChange={(e) => setFormData({...formData, children: Number(e.target.value)})}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Full Name</Label>
                        <Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>ID Card</Label>
                        <Input value={formData.id_card} onChange={(e) => setFormData({...formData, id_card: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Email</Label>
                        <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                     <div className="space-y-2 col-span-2">
                        <Label>Special Request</Label>
                        <Input value={formData.specialRequest} onChange={(e) => setFormData({...formData, specialRequest: e.target.value})} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl tracking-tight">Booking Management</h2>
                    <p className="text-gray-500">Manage reservations</p>
                </div>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Booking
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Create Booking</DialogTitle></DialogHeader>
                        {renderBookingForm()}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-cyan-600">Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Edit Booking</DialogTitle></DialogHeader>
                        {renderBookingForm()}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-cyan-600">Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar'>
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>  
                        </DialogHeader>
                        {viewingBooking && (
                            <div className="space-y-4 py-4">
                                <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-2">
                                    <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase">Booking Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Check-in</Label>
                                            <Input type="date" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Check-out</Label>
                                            <Input type="date" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Room No.</Label>
                                            <Input value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})} placeholder="101"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Price</Label>
                                            <Input type="number" value={formData.total_price} onChange={(e) => setFormData({...formData, total_price: e.target.value})}/>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 col-span-2 md:col-span-1">
                                            <div className="space-y-2">
                                                <Label>Adults</Label>
                                                <Input type="number" min={1} value={formData.adults} onChange={(e) => setFormData({...formData, adults: Number(e.target.value)})}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Children</Label>
                                                <Input type="number" min={0} value={formData.children} onChange={(e) => setFormData({...formData, children: Number(e.target.value)})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase">Guest Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label>Full Name</Label>
                                            <Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ID Card</Label>
                                            <Input value={formData.id_card} onChange={(e) => setFormData({...formData, id_card: e.target.value})} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Email</Label>
                                            <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Special Request</Label>
                                            <Input value={formData.specialRequest} onChange={(e) => setFormData({...formData, specialRequest: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Showing {filteredBookings.length} bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Guest</TableHead>
                                <TableHead>Identity number</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking: any) => (
                                <TableRow key={booking.booking_id}>
                                    <TableCell>#{booking.booking_id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{booking.full_name}</span>
                                            <span className="text-xs text-gray-500">{booking.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.id_card}</TableCell>
                                    <TableCell><Badge variant="outline">{booking.room_number || 'N/A'}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs">
                                            <span>In: {formatDateDisplay(booking.check_in)}</span>
                                            <span>Out: {formatDateDisplay(booking.check_out)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-right text-green-600">{formatPrice(booking.total_price || 0)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(booking)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(booking)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(booking.booking_id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-500">No bookings found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}