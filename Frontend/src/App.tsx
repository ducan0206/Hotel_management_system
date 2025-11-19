import Home from './pages/Home.tsx'
import SignIn from '../src/pages/SignUp.tsx'
import Footer from '../src/layouts/Footer.tsx'
import NavBar from '../src/layouts/NavBar.tsx'
import RoomsPage from '../src/pages/Room.tsx'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; 
import { AuthProvider } from '../src/context/AuthContext.tsx'
import { Toaster } from 'sonner';

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

function App() {
    return (
        <>
        <Toaster richColors />
        <AuthProvider>
            <main>
                <Router>
                    <Routes>
                        {/* Page with no navbar/footer */}
                        <Route element={<MainLayout />}> 
                            <Route path="/" element={<Home />} />
                            <Route path="/all-rooms" element={<RoomsPage />} />
                        </Route>

                        <Route path="/signin" element={<SignIn />} />
                        
                    </Routes>
                </Router>
            </main>
        </AuthProvider>
        </>
    )
}

export default App