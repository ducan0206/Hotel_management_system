import { useState } from "react";
import { Input } from "../../ui/input.tsx";
import { Button } from "../../ui/button.tsx";
import { User, Lock, Mail, Phone, PartyPopper } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.tsx';

export function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login, register  } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(loginData.username, loginData.password); 
        
      if (!success) {
        toast.error(<span className='mess'>Invalid username or password.</span>);
        return;
      }

      toast.success(
        <span className='mess'><PartyPopper /> Login successful! Welcome back. </span>
      );
      setLoginData({ username: "", password: "", });
      setIsLogin(true); 
      navigate('/');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "System error during login.";
      toast.error(<span className='mess'>{errorMessage}</span>); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async(e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      await register({
        fullName: registerData.fullName,
        phone: registerData.phone, 
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });
      toast.success(
        <span className='mess'><PartyPopper /> Account created successfully! </span>
      );
      setIsLogin(true);
      setRegisterData({ 
        fullName: "",
        phone: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error creating account.";
      toast.error(<span className='mess'>Registration failed: {error.message}</span>);
    } finally {
      setIsLoading(false);
    }
    console.log("Register:", registerData);
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`Login with ${platform}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-200 p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[650px] flex flex-col md:block">
        
        {/* --- LOGIN FORM SECTION (N?m bên TRÁI, hi?n khi isLogin = true) --- */}
        <div className={`w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute md:top-0 md:left-0 ${isLogin ? "md:opacity-100 md:z-20 md:translate-x-0" : "md:opacity-0 md:z-10 md:-translate-x-[20%]"}`}>
             <div className={!isLogin ? "hidden md:block" : ""}>
              <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Sign In</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="text-right">
                  <button type="button" className="text-cyan-600 hover:text-cyan-800 text-sm font-medium cursor-pointer">Forgot Password?</button>
                </div>
                <Button type="submit" className="w-full py-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-lg text-lg font-semibold transition-transform hover:scale-[1.02] cursor-pointer">
                  Login
                </Button>
              </form>
              {/* Mobile Toggle Text */}
              <div className="mt-6 text-center md:hidden">
                  <p className="text-gray-600">Don't have an account? <button onClick={() => setIsLogin(false)} className="text-cyan-600 font-bold">Register</button></p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full mt-3 py-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-lg text-lg font-semibold transition-transform hover:scale-[1.02] cursor-pointer">
                Return Home
              </Button>
          </div>
        </div>

        {/* --- REGISTER FORM SECTION (N?m bên PH?I, hi?n khi isLogin = false) --- */}
        <div className={`w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute md:top-0 md:left-1/2 ${!isLogin ? "md:opacity-100 md:z-20 md:translate-x-0" : "md:opacity-0 md:z-10 md:translate-x-[20%]"}`}>
            <div className={isLogin ? "hidden md:block" : ""}>
              <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Create Account</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    required
                  />
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Phone"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                  />
                  <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                   <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-4 pr-12 py-6 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <Button type="submit" className="w-full py-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-lg text-lg font-semibold transition-transform hover:scale-[1.02] cursor-pointer">
                  Register
                </Button>
              </form>
               {/* Mobile Toggle Text */}
               <div className="mt-6 text-center md:hidden">
                  <p className="text-gray-600">Already have an account? <button onClick={() => setIsLogin(true)} className="text-cyan-600 font-bold">Login</button></p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full mt-3 py-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-lg text-lg font-semibold transition-transform hover:scale-[1.02] cursor-pointer">
                Return Home
              </Button>
            </div>
        </div>

        {/* --- OVERLAY SECTION (Ph?n màu xanh ch?y qua ch?y l?i) --- */}
        <div className={`hidden md:block absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 text-white transition-transform duration-700 ease-in-out z-50 ${isLogin ? "translate-x-full rounded-l-[100px]" : "translate-x-0 rounded-r-[100px]"}`}>
           {/* Decorative Circles */}
           <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
           
           {/* N?i dung bên trong Overlay */}
           <div className="relative h-full w-full flex flex-col justify-center items-center text-center px-12">
              
              {/* 1. N?i dung G?i ý Sign Up (Hi?n khi ?ang ? trang Login) */}
              <div className={`absolute w-full transition-all duration-700 ${isLogin ? "opacity-100 translate-x-0 delay-200 pointer-events-auto" : "opacity-0 translate-x-[20%] pointer-events-none"}`}>
                  <h1 className="text-5xl font-bold mb-6">Hello, Friend!</h1>
                  <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    Enter your personal details and start <br/> your journey with us today.
                  </p>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-12 py-3 border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-cyan-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
              </div>

              {/* 2. N?i dung G?i ý Sign In (Hi?n khi ?ang ? trang Register) */}
              <div className={`absolute w-full transition-all duration-700 ${!isLogin ? "opacity-100 translate-x-0 delay-200 pointer-events-auto" : "opacity-0 -translate-x-[20%] pointer-events-none"}`}>
                  <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                  <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    To keep connected with us please <br/> login with your personal info.
                  </p>
                  <button
                    onClick={() => setIsLogin(true)}
                    className="px-12 py-3 border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-cyan-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default SignIn;