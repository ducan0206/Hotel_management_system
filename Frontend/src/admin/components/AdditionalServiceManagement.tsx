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
import { Switch } from '../../ui/switch';
import { Plus, Pencil, Trash2, Search, DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAdditionalServices } from '../../context/AdditionalServicesContext';
import { toast } from 'sonner';

export function AdditionalServiceManagement() {
    const { services, addService, updateService, deleteService, toggleServiceStatus } = useAdditionalServices();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
    const [formData, setFormData] = useState({
        service_name: '',
        price: '',
        description: '',
        status: 'active' as 'active' | 'inactive'
    });

    const resetForm = () => {
        setFormData({
            service_name: '',
            price: '',
            description: '',
            status: 'active'
        });
    };

    const handleSubmit = () => {
        if (!formData.service_name || !formData.price) {
            toast.error('Please enter both service name and price!');
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            toast.error('Invalid service price!');
            return;
        }

        const serviceData = {
            service_name: formData.service_name,
            price: price,
            description: formData.description,
            status: formData.status
        };

        if (isEditDialogOpen && editingService) {
            updateService(editingService.service_id, serviceData);
            toast.success('Service updated successfully!');
            setIsEditDialogOpen(false);
        } else {
            addService(serviceData);
            toast.success('New service added successfully!');
            setIsAddDialogOpen(false);
        }

        resetForm();
        setEditingService(null);
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setFormData({
            service_name: service.service_name,
            price: service.price.toString(),
            description: service.description,
            status: service.status
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: string, serviceName: string) => {
        if (confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
            deleteService(id);
            toast.success('Service deleted successfully!');
        }
    };

    const handleToggleStatus = (id: string, currentStatus: string) => {
        toggleServiceStatus(id);
        const newStatus = currentStatus === 'active' ? 'Inactive' : 'Active';
        toast.success(`Service status changed to ${newStatus}!`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('eu-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        if (status === 'active') {
        return (
                <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
            </Badge>
        );
        }
        return (
            <Badge variant="default" className="bg-gray-100 text-gray-800">
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
            </Badge>
        );
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = 
            service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const renderServiceForm = (isEdit: boolean) => (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-service_name' : 'service_name'}>Service name *</Label>
                <Input
                    id={isEdit ? 'edit-service_name' : 'service_name'}
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    placeholder="Example: Airport transfer"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-price' : 'price'}>Price (VND) *</Label>
                <Input
                    id={isEdit ? 'edit-price' : 'price'}
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="500000"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-description' : 'description'}>Description</Label>
                <Textarea
                    id={isEdit ? 'edit-description' : 'description'}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the service..."
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={isEdit ? 'edit-status' : 'status'}>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl">Additional Services Management</h2>
                    <p className="text-gray-500">Manage additional services for customers</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                            <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                            <DialogHeader>
                            <DialogTitle>Add new service</DialogTitle>
                            <DialogDescription>
                                Enter details for the new additional service
                            </DialogDescription>
                        </DialogHeader>
                        {renderServiceForm(false)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Add service</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit service</DialogTitle>
                            <DialogDescription>
                                Update service information
                            </DialogDescription>
                        </DialogHeader>
                        {renderServiceForm(true)}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Update</Button>
                        </DialogFooter>
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
                                placeholder="Search by service name or description..."
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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">Total services</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl">{services.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total number of services in the system
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">Active</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl text-green-600">
                            {services.filter(s => s.status === 'active').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Services currently provided
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">Inactive</CardTitle>
                        <XCircle className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl text-gray-600">
                            {services.filter(s => s.status === 'inactive').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Services temporarily suspended
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Service List */}
            <Card>
                <CardHeader>
                    <CardTitle>Service list</CardTitle>
                    <CardDescription>
                        Showing {filteredServices.length} services
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Updated at</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredServices.map((service) => (
                                <TableRow key={service.service_id}>
                                    <TableCell className="font-medium">{service.service_name}</TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="truncate text-sm text-gray-600">{service.description}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-green-600">
                                            <DollarSign className="h-3 w-3" />
                                            <span>{formatPrice(service.price)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="h-3 w-3" />
                                            <span>{formatDateTime(service.created_at)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-500">
                                            {formatDateTime(service.updated_at)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={service.status === 'active'}
                                                    onCheckedChange={() => handleToggleStatus(service.service_id, service.status)}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(service)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(service.service_id, service.service_name)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredServices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                                        No services found
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
