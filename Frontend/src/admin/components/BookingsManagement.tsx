import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [viewingBooking, setViewingBooking] = useState<any>(null);

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

    const mapFormToContext = (form: BookingFormState): BookingData => ({
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
            adults: form.adults,
            children: form.children
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
    });

    const mapContextToForm = (booking: any) => {
        setFormData({
            // ?u tiên l?y t? room object, n?u không có thì l?y t? root (d?ng ph?ng)
            room_number: booking.room?.room_number || booking.room_number || '',
            total_price: booking.room?.price || booking.total_price || 0,
            
            // X? lý ngày tháng
            checkIn: (booking.checkIn || booking.check_in) 
                ? new Date(booking.checkIn || booking.check_in).toISOString().split('T')[0] 
                : '',
            checkOut: (booking.checkOut || booking.check_out) 
                ? new Date(booking.checkOut || booking.check_out).toISOString().split('T')[0] 
                : '',
                
            specialRequest: booking.specialRequest || booking.special_request || '',
            
            // ?u tiên l?y t? guestInfo object, n?u không có thì l?y t? root
            full_name: booking.guestInfo?.fullName || booking.full_name || '',
            email: booking.guestInfo?.email || booking.email || '',
            phone: booking.guestInfo?.phone || booking.phone || '',
            id_card: booking.guestInfo?.idCard || booking.id_card || '',
            address: booking.guestInfo?.address || booking.address || '',
            
            // ?u tiên l?y t? guests object (l?u ý l?i chính t? adutls)
            adults: booking.guests?.adults || booking.adults || booking.adutls || 1,
            children: booking.guests?.children || booking.children || 0
        });
    };

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.checkIn || !formData.checkOut) {
            toast.error('Please fill in required fields!');
            return;
        }

        const payload = mapFormToContext(formData);

        try {
            if (editingId) {
                updateBooking(editingId, payload);
                toast.success('Booking updated successfully!');
                setIsEditDialogOpen(false);
            } else {
                addBooking(payload);
                toast.success('Booking created successfully!');
                setIsAddDialogOpen(false);
            }
            resetForm();
        } catch {
            toast.error('Failed to save booking.');
        }
    };

    const checkCanEdit = (booking: any) => {
        const today = new Date();
        const checkInDate = new Date(booking.check_in);

        const diffDays = Math.ceil(
            (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 2) {
            return false;
        }
        return true;
    }

    const handleEdit = (booking: any) => {
        if(!checkCanEdit(booking)) {
            toast.error(<span className='mess'>Customer can not change booking info.</span>);
            return;
        }
        console.log(booking);
        setEditingId(booking.booking_id);
        mapContextToForm(booking);
        setIsEditDialogOpen(true);
    };

    const handleViewDetails = (booking: any) => {
        setViewingBooking(booking);
        setIsViewDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this booking?')) {
            deleteBooking(id);
        }
    };

    /* ================== UTIL ================== */
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    const formatDate = (date: string) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

    /* ================== FILTER ================== */
    const filteredBookings = bookings.filter(b => {
        const q = searchQuery.toLowerCase();
        return (
            String(b.booking_id).includes(q) ||
            b.guestInfo?.fullName?.toLowerCase().includes(q) ||
            b.guestInfo?.phone?.includes(q)
        );
    });

    /* ================== VIEW RENDER ================== */
    const renderBookingView = (b: any) => (
        <div className="space-y-4 py-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-md border">
                <h3 className="font-semibold mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div><b>ID:</b> #{b.booking_id}</div>
                    <div><b>Room:</b> {b.room_number}</div>
                    <div><b>Check-in:</b> {formatDate(b.check_in)}</div>
                    <div><b>Check-out:</b> {formatDate(b.check_out)}</div>
                    <div><b>Adults:</b> {b.adutls}</div>
                    <div><b>Children:</b> {b.children}</div>
                    <div className="col-span-2">
                        <b>Total:</b> <span className="text-green-600">{formatPrice(b.total_price)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border">
                <h3 className="font-semibold mb-2">Guest Information</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><b>Name:</b> {b.full_name}</div>
                    <div><b>Phone:</b> {b.phone}</div>
                    <div><b>ID Card:</b> {b.id_card}</div>
                    <div className="col-span-2"><b>Email:</b> {b.email}</div>
                    <div className="col-span-2"><b>Address:</b> {b.address || 'N/A'}</div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border">
                <h3 className="font-semibold mb-2">Special Request</h3>
                <p>{b.specialRequest || 'None'}</p>
            </div>
        </div>
    );

    const formatDateDisplay = (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

    const renderBookingForm = () => (
        <div className="grid grid-cols-2 gap-4 py-4">

            <div className="col-span-2">
                <label className="text-sm font-medium">Full name *</label>
                <Input
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Guest name"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Room number</label>
                <Input
                    value={formData.room_number}
                    onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Total price</label>
                <Input
                    type="number"
                    value={formData.total_price}
                    onChange={e => setFormData({ ...formData, total_price: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Check-in *</label>
                <Input
                    type="date"
                    value={formData.checkIn}
                    onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Check-out *</label>
                <Input
                    type="date"
                    value={formData.checkOut}
                    onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Adults</label>
                <Input
                    type="number"
                    min={1}
                    value={formData.adults}
                    onChange={e => setFormData({ ...formData, adults: Number(e.target.value) })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Children</label>
                <Input
                    type="number"
                    min={0}
                    value={formData.children}
                    onChange={e => setFormData({ ...formData, children: Number(e.target.value) })}
                />
            </div>

            <div className="col-span-2">
                <label className="text-sm font-medium">Special request</label>
                <Input
                    value={formData.specialRequest}
                    onChange={e => setFormData({ ...formData, specialRequest: e.target.value })}
                />
            </div>
        </div>
    );

    /* ================== UI ================== */
    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-3xl">Booking Management</h2>
                    <p className="text-gray-500">Manage reservations</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Booking
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Create Booking</DialogTitle></DialogHeader>
                            {renderBookingForm()}
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* EDIT BOOKING DIALOG */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                        </DialogHeader>

                        {renderBookingForm()}

                        <DialogFooter>
                            <Button onClick={handleSubmit}>
                                Update
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                        <Input
                            className="pl-10"
                            placeholder="Search booking..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>{filteredBookings.length} records</CardDescription>
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
                                        <TableCell>
                                            <Badge variant="outline">{booking.room_number || 'N/A'}</Badge>
                                        </TableCell> 
                                        <TableCell> 
                                            <div className="flex flex-col text-xs"> 
                                                <span>In: {formatDateDisplay(booking.check_in)}</span> 
                                                <span>Out: {formatDateDisplay(booking.check_out)}</span> 
                                            </div> 
                                        </TableCell> 
                                        <TableCell className="font-medium text-right text-green-600">
                                            {formatPrice(booking.total_price || 0)}
                                        </TableCell> 
                                        <TableCell className="text-right"> 
                                            <div className="flex justify-end gap-2"> 
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleViewDetails(booking)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button> 
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleEdit(booking)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button> 
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(booking.booking_id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button> 
                                            </div> 
                                        </TableCell>
                                    </TableRow> )) ) : ( 
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow> )} 
                        </TableBody> 
                    </Table>
                </CardContent>
            </Card>

            {/* VIEW DIALOG */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                    </DialogHeader>
                    {viewingBooking && renderBookingView(viewingBooking)}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
