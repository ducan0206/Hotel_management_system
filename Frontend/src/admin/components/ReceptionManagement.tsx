import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../../ui/table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Alert, AlertDescription } from '../../ui/alert';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Users, UserPlus, CheckCircle2, UserIcon, Mail, Trash2, Calendar, } from 'lucide-react';

export function ReceptionManagement() {
    // Gi? s? useAuth cung c?p danh sách accounts và các hàm x? lý
    const { receptionAccounts, createReceptionAccount, deleteReceptionAccount, user } = useAuth();
    
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // Form States
    const [username, setUsername] = useState(''); // Thêm field này n?u API c?n username riêng
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState(''); // Thêm state cho phone
    
    // UI States
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Ki?m tra quy?n Admin
    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                B?n không có quy?n truy c?p trang này. Ch? Admin m?i có th? qu?n lý tài kho?n Reception.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validate
        if (password !== confirmPassword) {
            setError('Password is not matched.');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await createReceptionAccount({
                username: email.split('@')[0], 
                password,
                fullname,
                phone,
                email,
                role: 'employee' 
            });
            
            if (result) {
                setSuccess('Create account successfully!');
                // Reset form
                setFullname('');
                setEmail('');
                setPhone('');
                setPassword('');
                setConfirmPassword('');
                
                // ?óng dialog sau 1.5s
                setTimeout(() => {
                    setDialogOpen(false);
                    setSuccess('');
                }, 1500);
            } else {
                setError('Cannot create account. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while creating the account.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteAccount = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await deleteReceptionAccount(id);
                // Gi? s? deleteReceptionAccount trong context t? ??ng c?p nh?t state receptionAccounts
            } catch (error) {
                console.error("Delete failed", error);
                alert("Delete failed. Please try again.");
            }
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="h-8 w-8 text-green-600" />
                        Reception Management
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Statistics and management of reception accounts
                    </p>
                </div>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Reception Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Reception Account</DialogTitle>
                            <DialogDescription>
                                Enter information to create a new reception account
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleCreateAccount} className="space-y-4 mt-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            {success && (
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-900">{success}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        placeholder="Nguy?n V?n A"
                                        className="pl-10"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="0912345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="reception@hotel.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="????????"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="????????"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setDialogOpen(false)}
                                    disabled={isLoading}
                                >
                                    H?y
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? '?ang t?o...' : 'T?o tài kho?n'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Reception</p>
                                <p className="text-3xl font-bold">{receptionAccounts?.length || 0}</p>
                            </div>
                            <Users className="h-10 w-10 text-green-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active</p>
                                <p className="text-3xl font-bold">{receptionAccounts?.length || 0}</p>
                            </div>
                            <CheckCircle2 className="h-10 w-10 text-green-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Default Password</p>
                                <p className="text-lg font-mono">reception123</p>
                            </div>
                            <AlertCircle className="h-10 w-10 text-blue-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reception Accounts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>List of Reception Accounts</CardTitle>
                    <CardDescription>
                        Manage all reception accounts in the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receptionAccounts && receptionAccounts.length > 0 ? (
                                receptionAccounts.map((account: any) => (
                                    <TableRow key={account.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                    <UserIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                                <span className="font-medium">{account.fullname || account.fullName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                {account.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                {/* Format date n?u c?n, ví d?: new Date(account.createdAt).toLocaleDateString() */}
                                                {account.createdAt}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Active
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteAccount(account.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Users className="h-8 w-8 mb-2 opacity-50" />
                                            <p>No reception accounts found</p>
                                        </div>
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