import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuthLogin from '../components/Login/OAuthLogin';
import AuthForms from '../components/Login/AuthForms';
import { memo } from 'react';

const LoginPage = ({ user }) => {
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // If user is logged in, don't show login form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full">
        {/* Single unified container with left and right sections */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

            {/* Left Side - Custom Auth Forms */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-sm">
                <AuthForms />
              </div>
            </div>

            {/* Right Side - OAuth Login with subtle separator */}
            <div className="flex items-center justify-center p-8 lg:p-12 bg-gray-50 lg:border-l border-gray-200">
              <div className="w-full max-w-sm">
                <OAuthLogin />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);
