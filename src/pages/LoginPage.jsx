import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuthLogin from '../components/OAuthLogin';
import AuthForms from '../components/AuthForms';
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
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Side - Custom Auth Forms */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              <AuthForms />
            </div>
          </div>

          {/* Right Side - OAuth Login */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <OAuthLogin />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);
