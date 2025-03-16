
import React, { useState, useEffect } from 'react';
import { BarChart, Building2, Users, FileText, AlertTriangle, UserCheck, Building } from 'lucide-react';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '../UserProfile';
import { filterUsersByRole, getAllUsers, initializeUsersIfNeeded } from '@/utils/userService';

interface GovernmentDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const GovernmentDashboard: React.FC<GovernmentDashboardProps> = () => {
  const [displayFilter, setDisplayFilter] = useState<'all' | 'volunteer' | 'ngo'>('all');
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Initialize default users if needed
    initializeUsersIfNeeded();
    
    // Load all users
    const loadUsers = () => {
      const allUsers = getAllUsers();
      setUsers(allUsers.filter(user => user.role === 'volunteer' || user.role === 'ngo'));
    };
    
    loadUsers();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      loadUsers();
    };
    
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);
  
  const getFilteredUsers = () => {
    if (displayFilter === 'all') {
      return users;
    }
    return filterUsersByRole(users, displayFilter);
  };

  const filteredUsers = getFilteredUsers();
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden rounded-xl border border-white/10 glass-dark p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Building2 size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Government Response Hub</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Coordinate disaster response efforts, manage infrastructure recovery, and analyze impact assessments.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/command-center" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Command Center
                </Link>
                <Link to="/recovery-plan" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Recovery Plan
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <AnimatedTransition className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Active Incidents</h3>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Affected Areas</h3>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">People Affected</h3>
              <p className="text-2xl font-semibold">5,483</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Response Plans</h3>
              <p className="text-2xl font-semibold">7</p>
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedTransition delay={100} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Registered Volunteers and NGOs
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDisplayFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      displayFilter === 'all' 
                        ? 'bg-white text-black' 
                        : 'bg-white/10 hover:bg-white/15'
                    } transition-colors`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setDisplayFilter('volunteer')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      displayFilter === 'volunteer' 
                        ? 'bg-white text-black' 
                        : 'bg-white/10 hover:bg-white/15'
                    } transition-colors`}
                  >
                    <UserCheck className="h-3 w-3 inline mr-1" />
                    Volunteers
                  </button>
                  <button
                    onClick={() => setDisplayFilter('ngo')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      displayFilter === 'ngo' 
                        ? 'bg-white text-black' 
                        : 'bg-white/10 hover:bg-white/15'
                    } transition-colors`}
                  >
                    <Building className="h-3 w-3 inline mr-1" />
                    NGOs
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserProfile
                      key={user.id}
                      name={user.name}
                      role={user.role}
                      contactInfo={user.contactInfo}
                      location={user.location}
                      lastActive={user.lastActive}
                      skills={user.skills || []}
                      needsHelp={user.needsHelp || []}
                      userId={user.id}
                    />
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center">
                    <p className="text-gray-400">No {displayFilter === 'volunteer' ? 'volunteers' : displayFilter === 'ngo' ? 'NGOs' : 'users'} found</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/all-helpers" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors inline-block">
                  View All Registered Helpers
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedTransition>
        
        <div className="space-y-6">
          <AnimatedTransition delay={200}>
            <div className="bg-black/20 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Critical Alerts</h3>
              
              <div className="space-y-3">
                <StatusUpdate
                  id="govt-status-1"
                  title="Flooding in South District"
                  message="Water levels rising. Evacuation in progress. Emergency services deployed."
                  source="Emergency Management"
                  timestamp="35 minutes ago"
                  priority="high"
                />
                
                <StatusUpdate
                  id="govt-status-2"
                  title="Bridge Structural Issues"
                  message="Highway 95 bridge showing damage. Engineers dispatched. Avoid area."
                  source="Transportation Department"
                  timestamp="2 hours ago"
                  priority="high"
                />
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className="bg-black/20 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Agency Coordination</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Emergency Services</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Public Health</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Transportation</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Utilities</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
