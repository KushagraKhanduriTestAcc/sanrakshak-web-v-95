import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import AnimatedTransition from '../components/AnimatedTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const loggedInUser = users.find((user: any) => user.email === email && user.password === password);
    
    if (loggedInUser) {
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${loggedInUser.name}!`,
      });
      
      // Get current users array
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Check if this user is already in our users array
      const userExists = users.some((u: any) => u.id === loggedInUser.id);
      
      if (!userExists) {
        // Add the new user to our users array with appropriate structure
        users.push({
          id: loggedInUser.id,
          name: loggedInUser.name,
          role: loggedInUser.role,
          contactInfo: loggedInUser.email || loggedInUser.phone || 'No contact info',
          location: loggedInUser.location || 'Unknown location',
          lastActive: 'just now',
          skills: loggedInUser.role === 'volunteer' ? ['New Volunteer'] : [],
          needsHelp: loggedInUser.role === 'victim' ? ['Newly Registered'] : []
        });
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        // Update the last active time for existing user
        const updatedUsers = users.map((u: any) => {
          if (u.id === loggedInUser.id) {
            return { ...u, lastActive: 'just now' };
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('auth-changed'));
      
      if (loggedInUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please check your email and password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <AnimatedTransition>
            <div className="bg-black/20 rounded-xl border border-white/10 p-8">
              <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/30 border-white/30 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/30 border-white/30 text-white pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                  Login
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gray-300">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                </p>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/5 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-gray-400">
                Relief Connect • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-gray-500">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
