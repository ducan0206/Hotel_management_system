import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Hotel, Users, DollarSign, Calendar, BedDouble, UserCheck, Settings, Bell, Search, Menu, Home } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { BookingChart } from "../components/BookingChart";
import { RecentBookings } from "../components/RecentBookings";
import { ReceptionManagement } from "../components/ReceptionManagement";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'reception'>('dashboard');
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Hotel className="h-8 w-8 text-blue-600" />
            <span className="text-xl">PASK Hotel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('dashboard')}
          >
            <Hotel className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <BedDouble className="h-4 w-4" />
            Rooms
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Calendar className="h-4 w-4" />
            Bookings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-4 w-4" />
            Guests
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <DollarSign className="h-4 w-4" />
            Revenue
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Customer View
          </Button>
          {isAdmin && (
            <Button 
              variant={currentView === 'reception' ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setCurrentView('reception')}
            >
              <UserCheck className="h-4 w-4" />
              Reception Management
            </Button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Admin</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
              </Button>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentView === 'reception' ? (
              <ReceptionManagement />
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Rooms"
                    value="150"
                    change="+2 from last month"
                    icon={<BedDouble className="h-5 w-5 text-blue-600" />}
                    trend="up"
                  />
                  <StatCard
                    title="Occupied Rooms"
                    value="127"
                    change="84.6% occupancy"
                    icon={<UserCheck className="h-5 w-5 text-green-600" />}
                    trend="up"
                  />
                  <StatCard
                    title="Today's Check-ins"
                    value="18"
                    change="+3 from yesterday"
                    icon={<Calendar className="h-5 w-5 text-purple-600" />}
                    trend="up"
                  />
                  <StatCard
                    title="Revenue (Month)"
                    value="$45,680"
                    change="+12.5% from last month"
                    icon={<DollarSign className="h-5 w-5 text-orange-600" />}
                    trend="up"
                  />
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Booking Trends Chart */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                        <CardDescription>Daily bookings over the last 7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BookingChart />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Room Status</CardTitle>
                      <CardDescription>Current room availability</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available</span>
                        <span className="text-green-600">23 rooms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Occupied</span>
                        <span className="text-blue-600">127 rooms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Maintenance</span>
                        <span className="text-orange-600">5 rooms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Reserved</span>
                        <span className="text-purple-600">12 rooms</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span>Occupancy Rate</span>
                          <span className="text-blue-600">84.6%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84.6%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Bookings Table */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>Latest reservations and check-ins</CardDescription>
                      </div>
                      <Button variant="outline">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecentBookings />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard