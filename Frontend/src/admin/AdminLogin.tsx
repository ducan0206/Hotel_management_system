import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Hotel, ArrowLeft, Shield, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'
import { PartyPopper } from 'lucide-react'

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminData, setAdminData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if(adminData.email.trim() === '') {
                toast.error(<span className='mess'>Email is required</span>)
            } else if(adminData.password.trim() === '') {
                toast.error(<span className='mess'>Password is required</span>)
            }
            const success = await login(adminData.email, adminData.password, "admin");
            if (!success) {
                toast.error(<span className='mess'>Invalid username or password.</span>);
                return;
            }

            toast.success(
                <span className='mess'><PartyPopper /> Login successful! Welcome back. </span>
            );
            setAdminData({ email: "", password: ""});
            navigate('/admin/dashboard')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "System error during login.";
            toast.error(<span className='mess'>{errorMessage}</span>); 
        } finally {
            setLoading(false);
        }
    };

    function onBack() {
        navigate('/');
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden rounded-r-full">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>            
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white mb-8">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <Hotel className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl">PASK Hotel</h1>
                            <p className="text-blue-200 text-sm">Administration system  </p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 text-white">
                        <h2 className="text-4xl font-semibold leading-tight">
                            Welcome to <br />
                            <span className="text-blue-200">Administration page</span>
                        </h2>
                        <p className="text-blue-100 text-lg max-w-md">
                            Manage reservations, customers and hotel services easily and efficiently.
                        </p>
                    </div>
                </div>
                
                <div className="relative z-10 text-white/80 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm">High security</p>
                            <p className="text-xs text-white/60">Data is encryted and protected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Hotel className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm">Comprehensive management</p>
                            <p className="text-xs text-white/60">Control every aspect of the hotel</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-6 -ml-3"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return home page
                    </Button>

                    <Card className="shadow-xl border-0">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Shield className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">
                                Admin login
                            </CardTitle>
                            <CardDescription className="text-center">
                                Access the admin console
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Administrator user</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                        id="admin-email"
                                        type="email"
                                        placeholder="admin@hotel.com"
                                        className="pl-10"
                                        value={adminData.email}
                                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                        required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin-password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                        id="admin-password"
                                        type="password"
                                        placeholder="????????"
                                        className="pl-10"
                                        value={adminData.password}
                                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                        required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        <span className="text-gray-600">Remember</span>
                                    </label>
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Forget password?
                                    </a>
                                </div>
                                <Button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700" 
                                size="lg"
                                disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Log in'}
                                </Button>
                                <div className="pt-4 border-t">
                                    <p className="text-xs text-center text-gray-500">
                                        This page is only for administrators of PASK hotel
                                        <br />
                                        Unauthorized access may be handled according to regulations.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>© 2025 PASK Hotel. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage