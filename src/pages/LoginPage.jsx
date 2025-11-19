import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/loginButton';

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

  return <Login />;
};

export default LoginPage;
