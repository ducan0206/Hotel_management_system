import {useState} from 'react'
import { Hotel, LogIn, User, LogOut } from "lucide-react";
import {Button} from '../component/ui/button.tsx'
import {Avatar, AvatarFallback} from '../component/ui/avatar.tsx'
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem} from '../component/ui/dropdown-menu.tsx'
import { useAuth } from '../context/AuthContext.tsx';

interface CustomerHomeProps {
    roomsData: Array<{
        name: string;
        image: string;
        price: string;
        capacity: string;
        size: string;
        description: string;
        fullDescription: string;
        images: string[];
        amenities: string[];
        bedType: string;
        maxGuests: number;
    }>;
    onAdminLogin: () => void;
}

const NavBar = ({ roomsData, onAdminLogin }: CustomerHomeProps) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [selectedRoom, setSelectedRoom] = useState<typeof roomsData[0] | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const handleViewDetails = (room: typeof roomsData[0]) => {
        setSelectedRoom(room);
        setDialogOpen(true);
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
        setLoginOpen(true);
        } else {
        // Handle booking logic
        alert('Booking functionality coming soon!');
        }
    };

    function returnHomePage() {
        
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <button className="logo" onClick={() => returnHomePage()}></button>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#roomcarousel" className="text-gray-700 hover:text-blue-600 transition-colors">Rooms</a>              
              <a href="#amenities" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && user?.role === 'customer' ? (
                <>
                  <Button onClick={handleBookNow}>Book Now</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>   
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div>
                          <p>{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onAdminLogin}>
                    Admin
                  </Button>
                  <Button variant="outline" onClick={() => setLoginOpen(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
}

export default NavBar