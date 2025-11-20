import {LogIn, User, LogOut, TicketCheck } from "lucide-react";
import {Button} from '../ui/button.tsx'
import {Avatar, AvatarFallback} from '../ui/avatar.tsx'
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem} from '../ui/dropdown-menu.tsx'
import { useAuth } from '../context/AuthContext.tsx';
import {useNavigate} from 'react-router-dom'


const NavBar = () => { 
    const { user, logout, isAuthenticated } = useAuth();

    const navigate = useNavigate();
    
    const handleBookNow = () => {
        if (!isAuthenticated) {
          navigate('/signin', { state: { defaultTab: 'login' } }); 
        } else {
          navigate('/all-rooms');
        }
    };
    
    const handleAdminLogin = () => {
        navigate('/admin-login'); 
    };

    function returnHomePage() {
        navigate('/');
    }

    return (
        <nav className="bg-transparent fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-700 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <button className="logo" onClick={() => returnHomePage()}></button>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors text-lg">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors text-lg">About</a>
              <a href="#roomcarousel" className="text-gray-700 hover:text-blue-600 transition-colors text-lg">Rooms</a> 
              <a href="#amenities" className="text-gray-700 hover:text-blue-600 transition-colors text-lg">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors text-lg">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && user?.role === 'customer' ? (
                <>
                  <Button onClick={handleBookNow} className="ml-5">Book Now</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-cyan-500 hover:scale-[1.05] shadow-md"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-cyan-600 text-white font-semibold text-lg cursor-pointer w-full h-full flex items-center justify-center rounded-full">
                            {user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                      align="end"
                      className="w-64 p-2 rounded-lg border border-gray-300 bg-white shadow-2xl z-50 
                                 data-[state=open]:animate-in data-[state=closed]:animate-out 
                                 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
                                 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
                                 data-[side=bottom]:slide-in-from-top-2 transition-all duration-150"
                    >
                      <DropdownMenuLabel className="p-2">
                        <div>
                          <p className="text-base font-bold">{user.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem className="p-2 transition-colors hover:bg-cyan-50 hover:text-cyan-700 cursor-pointer font-bold">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2 transition-colors hover:bg-cyan-50 hover:text-cyan-700 cursor-pointer font-bold">
                        < TicketCheck className="mr-2 h-4 w-4" />
                        My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="p-2 text-red-600 transition-colors hover:bg-red-50 cursor-pointer font-bold">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleAdminLogin}> 
                    Admin
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/signin')}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signin', { state: { defaultTab: 'register' } })}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
}

export default NavBar