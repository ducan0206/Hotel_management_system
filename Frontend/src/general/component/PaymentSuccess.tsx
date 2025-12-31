import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button.tsx";
import { Card, CardContent, CardFooter } from "../../ui/card.tsx";
import { CheckCircle, Home } from "lucide-react";
import { Separator } from "../../ui/separator.tsx";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                
                <div className="bg-gradient-to-b from-green-50 to-white pt-10 pb-6 flex flex-col items-center text-center px-6">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Thank you for your booking. Your transaction has been completed successfully.
                    </p>
                </div>

                <CardContent className="px-6 pb-2">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Transaction ID</span>
                            <span className="font-mono font-medium text-slate-700">#TRX-{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                        
                        <Separator className="bg-slate-200"/>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Payment Method</span>
                            <span className="font-medium text-slate-900">Credit Card</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className="font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                Paid
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        A confirmation email has been sent to your email address.<br/>
                        Please check your inbox (and spam folder) for details.
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-6 pt-2">
                    <Button 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-6 text-base shadow-md shadow-cyan-200"
                        onClick={() => navigate("/")}
                    >
                        <Home className="w-5 h-5 mr-2" /> Back to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}