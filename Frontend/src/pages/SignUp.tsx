import { useState } from "react";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { User, Lock, Mail } from "lucide-react";
import {useNavigate} from 'react-router-dom'

export function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Register:", registerData);
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`Login with ${platform}`);
  };

  // Component nút Social ?? tái s? d?ng cho g?n code
  const SocialButtons = () => (
    <div className="flex justify-center gap-4">
      {["Google", "Facebook", "GitHub", "LinkedIn"].map((platform) => (
        <button
          key={platform}
          onClick={() => handleSocialLogin(platform)}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all flex items-center justify-center text-gray-600 hover:text-cyan-600 cursor-pointer"
          title={`Continue with ${platform}`}
          type="button"
        >
             {platform === "Google" && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>}
             {platform === "Facebook" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
             {platform === "GitHub" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
             {platform === "LinkedIn" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
        </button>
      ))}
    </div>
  );

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
              <div className="mt-8">
                <p className="text-center text-gray-500 text-sm mb-4">Or login with</p>
                <SocialButtons />
              </div>
              {/* Mobile Toggle Text */}
              <div className="mt-6 text-center md:hidden">
                  <p className="text-gray-600">Don't have an account? <button onClick={() => setIsLogin(false)} className="text-cyan-600 font-bold">Register</button></p>
              </div>
              <button className={`mx-auto flex justify-center border-1 w-full mt-3 p-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:to-teal-600 text-white rounded-full shadow-lg font-semibold cursor-pointer transition-transform hover:scale-[1.02]`} onClick={() => navigate("/")}>Return home</button>
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
              <div className="mt-8">
                <p className="text-center text-gray-500 text-sm mb-4">Or register with</p>
                <SocialButtons />
              </div>
               {/* Mobile Toggle Text */}
               <div className="mt-6 text-center md:hidden">
                  <p className="text-gray-600">Already have an account? <button onClick={() => setIsLogin(true)} className="text-cyan-600 font-bold">Login</button></p>
              </div>
              <button className={`mx-auto flex justify-center border-1 w-full mt-3 p-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:to-teal-600 text-white rounded-full shadow-lg font-semibold cursor-pointer transition-transform hover:scale-[1.02] cursor-pointer`} onClick={() => navigate("/")}>Return home</button>

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