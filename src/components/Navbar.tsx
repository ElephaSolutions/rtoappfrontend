
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { NavLink, useNavigate } from 'react-router-dom';
import { Car, Home, FileText, CreditCard, LogOut } from 'lucide-react';

const BACKEND_URL = "https://rtoappbyourself.onrender.com/logout"

const Navbar = () => {
  const { config, loading } = useBusinessConfig();
  const navigate = useNavigate()

  const handleLogout = (): void => {
    fetch(
      BACKEND_URL,
      {
        method: "POST",
        credentials: "include"
      }
    ).then(response => {
      if(response.ok)
        navigate("/login")
      else
        throw new Error("Error calling logout")
    })
  }

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="animate-pulse bg-gray-300 h-8 w-48 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/vehicle', label: 'Add Vehicle', icon: Car },
    { to: '/vehicle/view', label: 'View Vehicles', icon: FileText },
    // { to: '/license/view', label: 'License', icon: CreditCard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {config?.brandName}
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: config?.theme.primary } : {}
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
              onClick={handleLogout}
            >
              <LogOut className='w-4 h-4'/>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
