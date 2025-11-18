import Home from './pages/Home.tsx'
import SignIn from '../src/pages/SignUp.tsx'
import Footer from '../src/layouts/Footer.tsx'
import NavBar from '../src/layouts/NavBar.tsx'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; // 1. Nh? import Outlet
import { AuthProvider } from '../src/context/AuthContext.tsx'
import { Toaster } from 'sonner';

// 2. T?o Layout Component (Ho?c tách ra file riêng n?u mu?n)
const MainLayout = () => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen"> {/* Thêm div này ?? content ??y footer xu?ng n?u c?n */}
        <Outlet /> {/* ?ây là n?i Home ho?c các trang con s? hi?n th? */}
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
                        {/* TR??NG H?P 1: Các trang C?N NavBar và Footer */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            {/* N?u sau này có trang About, Contact thì thêm vào ?ây */}
                        </Route>

                        {/* TR??NG H?P 2: Các trang KHÔNG C?N NavBar và Footer (n?m ngoài MainLayout) */}
                        <Route path="/signin" element={<SignIn />} />
                        
                    </Routes>
                </Router>
            </main>
        </AuthProvider>
        </>
    )
}

export default App