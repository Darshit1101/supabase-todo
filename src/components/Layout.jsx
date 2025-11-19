import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { LogOut, User, Home } from 'lucide-react';

const Layout = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  Todo App
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  {user.email}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
