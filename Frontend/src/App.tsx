import Home from './general/pages/Home.tsx'
import SignIn from './general/pages/SignUp.tsx'
import Footer from './general/layouts/Footer.tsx'
import NavBar from './general/layouts/NavBar.tsx'
import RoomsPage from './general/pages/Room.tsx'
import Booking from './general/pages/Booking.tsx'
import AdminLoginPage from './admin/AdminLogin.tsx'
import HotelAuthentication from './admin/HotelAuthentication.tsx'
import ReceptionLoginPage from './admin/ReceptionLogin.tsx'
import Dashboard from './admin/pages/Dashboard.tsx'

import AnimatedPage from './AnimatedPage.tsx'
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext.tsx'
import { RoomProvider } from './context/RoomContext.tsx'
import { Toaster } from 'sonner';
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const MainLayout = () => {
    return (
        <>
        <NavBar/>
        <div className="min-h-screen"> 
            <Outlet /> 
        </div>
        <Footer />
        </>
    );
};

const queryClient = new QueryClient();

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/* USER PAGES */}
                <Route element={<MainLayout />}> 
                <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
                <Route path="/all-rooms" element={<AnimatedPage><RoomsPage /></AnimatedPage>} />
                <Route path="/booking/:room_id" element={<AnimatedPage><Booking /></AnimatedPage>} />
                </Route>

                {/* AUTH PAGES */}
                <Route path="/signin" element={<AnimatedPage><SignIn /></AnimatedPage>} />
                <Route path="/admin/auth" element={<AnimatedPage><AdminLoginPage /></AnimatedPage>} />
                <Route path="/reception/auth" element={<AnimatedPage><ReceptionLoginPage /></AnimatedPage>} />
                <Route path="/hotel/auth" element={<AnimatedPage><HotelAuthentication /></AnimatedPage>} />
                <Route path="/admin/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />

            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <>
        <Toaster richColors />
        
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RoomProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </RoomProvider>
            </AuthProvider>
        </QueryClientProvider>
        </>
    );
}

export default App;
