import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Plus, Pencil, Trash2, Search, Eye, Phone, Mail, CreditCard, MapPin, User, Calendar } from 'lucide-react';
import { useGuests } from '../../context/GuestContext';
import { toast } from 'sonner';

export function GuestManagement() {
    const { guests, addGuest, updateGuest, deleteGuest, getGuestBookings } = useGuests();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<any>(null);
    const [viewingGuest, setViewingGuest] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'regular' | 'vip' | 'blacklist'>('all');
  
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        idCard: '',
        address: '',
        nationality: '',
        dateOfBirth: '',
        gender: 'male' as 'male' | 'female' | 'other',
        status: 'regular' as 'regular' | 'vip' | 'blacklist',
        notes: ''
    });

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            idCard: '',
            address: '',
            nationality: '',
            dateOfBirth: '',
            gender: 'male',
            status: 'regular',
            notes: ''
        });
    };

    const handleSubmit = () => {
        if (!formData.fullName || !formData.email || !formData.phone || !formData.idCard) {
            toast.error('Please fill in all required fields!');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Invalid email!');
            return;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Invalid phone number!');
            return;
        }

        const guestData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            idCard: formData.idCard,
            address: formData.address,
            nationality: formData.nationality,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            status: formData.status,
            notes: formData.notes || undefined
        };

        if (isEditDialogOpen && editingGuest) {
            updateGuest(editingGuest.id, guestData);
            toast.success('Guest information updated successfully!');
            setIsEditDialogOpen(false);
        } else {
            addGuest(guestData);
            toast.success('New guest added successfully!');
            setIsAddDialogOpen(false);
        }

        resetForm();
        setEditingGuest(null);
    };

    const handleEdit = (guest: any) => {
        setEditingGuest(guest);
        setFormData({
            fullName: guest.fullName,
            email: guest.email,
            phone: guest.phone,
            idCard: guest.idCard,
            address: guest.address,
            nationality: guest.nationality,
            dateOfBirth: guest.dateOfBirth,
            gender: guest.gender,
            status: guest.status,
            notes: guest.notes || ''
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this guest?')) {
            deleteGuest(id);
            toast.success('Guest deleted successfully!');
        }
    };

    const handleViewDetails = (guest: any) => {
        setViewingGuest(guest);
        setIsViewDialogOpen(true);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('eu-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getBookingStatusBadge = (status: string) => {
        const statusConfig = {
            completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
            cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
            'no-show': { label: 'No-show', className: 'bg-orange-100 text-orange-800' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge variant="default" className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const filteredGuests = guests.filter(guest => {
        const matchesSearch = 
        guest.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery);
                
        return matchesSearch;
    });

    const renderGuestForm = (isEdit: boolean) => (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor={isEdit ? 'edit-fullName' : 'fullName'}>Full Name *</Label>
                    <Input
                        id={isEdit ? 'edit-fullName' : 'fullName'}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-email' : 'email'}>Email *</Label>
                    <Input
                        id={isEdit ? 'edit-email' : 'email'}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-phone' : 'phone'}>Phone Number *</Label>
                    <Input
                        id={isEdit ? 'edit-phone' : 'phone'}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-idCard' : 'idCard'}>ID Card/Passport *</Label>
                    <Input
                        id={isEdit ? 'edit-idCard' : 'idCard'}
                        value={formData.idCard}
                        onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                        placeholder="001234567890"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-dateOfBirth' : 'dateOfBirth'}>Date of Birth</Label>
                    <Input
                        id={isEdit ? 'edit-dateOfBirth' : 'dateOfBirth'}
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-gender' : 'gender'}>Gender</Label>
                    <Select value={formData.gender} onValueChange={(value: any) => setFormData({ ...formData, gender: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-nationality' : 'nationality'}>Nationality</Label>
                    <Input
                        id={isEdit ? 'edit-nationality' : 'nationality'}
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        placeholder="Vietnam"
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <Label htmlFor={isEdit ? 'edit-address' : 'address'}>Address</Label>
                    <Input
                        id={isEdit ? 'edit-address' : 'address'}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 ABC St, District 1, Ho Chi Minh City"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={isEdit ? 'edit-status' : 'status'}>Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="blacklist">Blacklist</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 col-span-2">
                    <Label htmlFor={isEdit ? 'edit-notes' : 'notes'}>Notes</Label>
                    <Textarea
                        id={isEdit ? 'edit-notes' : 'notes'}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Notes about the guest (optional)..."
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl">Guest Management</h2>
                    <p className="text-gray-500">Manage guest information and booking history</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Guest
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Guest</DialogTitle>
                            <DialogDescription>
                                Enter detailed information for the new guest
                            </DialogDescription>
                        </DialogHeader>
                        {renderGuestForm(false)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Add Guest</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Guest Information</DialogTitle>
                            <DialogDescription>
                                Update guest information
                            </DialogDescription>
                        </DialogHeader>
                        {renderGuestForm(true)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Guest Details</DialogTitle>
                        </DialogHeader>
                        {viewingGuest && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-500">Full name</Label>
                                        <p className="text-lg">{viewingGuest.full_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Email</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <p>{viewingGuest.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Phone number</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <p>{viewingGuest.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">ID Card/Passport</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CreditCard className="h-4 w-4 text-gray-400" />
                                            <p>{viewingGuest.idCard}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Date of Birth</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p>{formatDate(viewingGuest.dateOfBirth)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Nationality</Label>
                                        <p className="mt-1">{viewingGuest.nationality}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Gender</Label>
                                        <p className="mt-1">
                                            {viewingGuest.gender === 'male' ? 'Male' : viewingGuest.gender === 'female' ? 'Female' : 'Other'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-gray-500">Address</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <p>{viewingGuest.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label className="text-gray-500">Registration Date</Label>
                                        <p className="text-lg">{formatDate(viewingGuest.registeredDate)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Total Bookings</Label>
                                        <p className="text-lg">{viewingGuest.totalBookings} times</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Total Spent</Label>
                                        <p className="text-lg text-green-600">{formatPrice(viewingGuest.totalSpent)}</p>
                                    </div>
                                </div>

                                {viewingGuest.notes && (
                                    <div>
                                        <Label className="text-gray-500">Notes</Label>
                                        <p className="mt-1 p-3 bg-yellow-50 rounded border border-yellow-200">{viewingGuest.notes}</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg mb-3">Booking History</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Room</TableHead>
                                                <TableHead>Room Type</TableHead>
                                                <TableHead>Check-in</TableHead>
                                                <TableHead>Check-out</TableHead>
                                                <TableHead>Total Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getGuestBookings(viewingGuest.id).map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>{booking.roomNumber}</TableCell>
                                                    <TableCell>{booking.roomType}</TableCell>
                                                    <TableCell>{formatDate(booking.checkIn)}</TableCell>
                                                    <TableCell>{formatDate(booking.checkOut)}</TableCell>
                                                    <TableCell>{formatPrice(booking.totalAmount)}</TableCell>
                                                    <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                            {getGuestBookings(viewingGuest.id).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                                        No booking history
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, phone, ID..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </div>
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="blacklist">Blacklist</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardContent>
            </Card>

            {/* Guest List */}
            <Card>
                <CardHeader>
                    <CardTitle>Guest List</CardTitle>
                    <CardDescription>
                        Total {filteredGuests.length} guests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Total Bookings</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell>{guest.KH_id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span>{guest.full_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{guest.email}</TableCell>
                                    <TableCell>{guest.phone}</TableCell>
                                    <TableCell>{guest.total_booking} times</TableCell>
                                    <TableCell>{formatPrice(guest.total_spent)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewDetails(guest)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(guest)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(guest.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredGuests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                                        No guests found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
