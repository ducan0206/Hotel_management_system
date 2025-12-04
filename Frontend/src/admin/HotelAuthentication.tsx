import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { UserCog, Contact2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotelAuthentication = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
            <div className="w-full max-w-xl space-y-6">
                <h2 className="text-5xl font-semibold text-center">Select Management Role</h2>
                <p className="text-center text-gray-600 max-w-sm mx-auto">
                    Choose the role you want to access in the hotel management system
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                    {/* Admin Card */}
                    <Card className="hover:shadow-lg transition cursor-pointer"
                        onClick={() => navigate("/admin/auth")}
                    >
                        <CardHeader className="text-center">
                            <UserCog className="w-12 h-12 mx-auto text-blue-600" />
                            <CardTitle className="mt-2">Administrator</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600 text-sm">
                            Full system control including reservations, users, room types and services.
                        </CardContent>
                    </Card>

                    {/* Reception Card */}
                    <Card className="hover:shadow-lg transition cursor-pointer"
                        onClick={() => navigate("/reception/auth")}
                    >
                        <CardHeader className="text-center">
                            <Contact2 className="w-12 h-12 mx-auto text-green-600" />
                            <CardTitle className="mt-2">Receptionist</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600 text-sm">
                            Manage bookings, check-ins, check-outs and customer support.
                        </CardContent>
                    </Card>

                </div>

                <div className="text-center mt-4 text-gray-500 text-sm">
                    © 2025 PASK Hotel ? Management System
                </div>
            </div>
        </div>
    );
}

export default HotelAuthentication