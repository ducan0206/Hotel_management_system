import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Hotel, ArrowLeft, Shield, Lock, Mail, PartyPopper } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReceptionLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // ? ch? dùng 1 state loginData
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // ? ch? 1 bi?n loading

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if(loginData.username.trim() === '') {
                toast.error(<span className='mess'>Username is required</span>);
                return;
            }
            if(loginData.password.trim() === '') {
                toast.error(<span className='mess'>Password is required</span>);
                return;
            } 
            const success = await login(loginData.username, loginData.password, "employee");

            if (!success) {
                toast.error(<span className="mess">Invalid username or password.</span>);
                return;
            }

            toast.success(
                <span className="mess">
                    <PartyPopper /> Login successful! Welcome back.
                </span>
            );

            navigate('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "System error during login.";
            toast.error(<span className="mess">{errorMessage}</span>);
        } finally {
            setLoading(false);
        }
    };

    function onBack() {
        navigate('/');
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

            {/* --- LEFT PANEL --- */}
            <div className="hidden lg:flex bg-gradient-to-br from-green-600 via-green-700 to-green-900 p-12 flex-col justify-between relative overflow-hidden rounded-r-full">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white mb-8">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <Hotel className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl">PASK Hotel</h1>
                            <p className="text-green-200 text-sm">Administration system</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-white">
                        <h2 className="text-4xl font-semibold leading-tight">
                            Welcome to <br />
                            <span className="text-green-200">Administration page</span>
                        </h2>
                        <p className="text-green-100 text-lg max-w-md">
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
                            <p className="text-xs text-white/60">Data is encrypted and protected</p>
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

            {/* --- RIGHT PANEL (FORM) --- */}
            <div className="flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">

                    <Button variant="ghost" onClick={onBack} className="mb-6 -ml-3">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return home page
                    </Button>

                    <Card className="shadow-xl border-0">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <Shield className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">Reception login</CardTitle>
                            <CardDescription className="text-center">Access the reception console</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Username */}
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="reception123"
                                            className="pl-10"
                                            value={loginData.username}
                                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            className="pl-10"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Log in"}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>© 2025 PASK Hotel. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionLogin;
