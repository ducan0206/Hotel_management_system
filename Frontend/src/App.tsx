import Home from './general/pages/Home.tsx'
import SignIn from './general/pages/SignUp.tsx'
import Footer from './general/layouts/Footer.tsx'
import NavBar from './general/layouts/NavBar.tsx'
import RoomsPage from './general/pages/Room.tsx'
import Booking from './general/pages/Booking.tsx'
import AdminLoginPage from './admin/AdminLogin.tsx'
import HotelAuthentication from './admin/HotelAuthentication.tsx'
import ReceptionLoginPage from './admin/ReceptionLogin.tsx'

import AnimatedPage from './AnimatedPage.tsx'
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'sonner';
import { AnimatePresence } from "framer-motion";

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

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <>
      <Toaster richColors />
      
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
