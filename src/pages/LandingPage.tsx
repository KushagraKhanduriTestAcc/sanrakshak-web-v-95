
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { useTheme } from '@/context/ThemeProvider';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AnimatedTransition from '@/components/AnimatedTransition';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in and update state
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          // Verify that the stored data is valid JSON
          const parsedUser = JSON.parse(authUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('authUser');
            setUser(null);
          }
        } else {
          localStorage.removeItem('authUser'); // Ensure it's removed
          setUser(null);
        }
      } catch (e) {
        // Clear invalid data
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <AnimatedTransition>
        <div className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0">
            <BackgroundPaths title="Sanrakshak" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto flex flex-col items-center space-y-6 -mt-20">
{/*                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">Sanrakshak</h2> */}
                
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-sm md:text-base font-medium">
                  <span>Emergency Response Platform</span>
                </div>
                
                <p className="text-lg md:text-xl mb-6 text-neutral-700 dark:text-neutral-300">
                  Connect those in need with volunteers, NGOs, and government resources during emergencies.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                  {isLoading ? (
                    <div className="h-12 bg-gray-100 dark:bg-white/10 animate-pulse rounded-lg w-40"></div>
                  ) : user ? (
                    <RainbowButton onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </RainbowButton>
                  ) : (
                    <>
                      <RainbowButton onClick={handleGetStarted}>
                        Get Started
                      </RainbowButton>
                      <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-6 py-2 rounded-xl text-base font-medium bg-transparent border-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default LandingPage;
