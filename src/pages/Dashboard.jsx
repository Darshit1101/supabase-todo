import { useNavigate } from 'react-router-dom';
import Crud from '../components/crud';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  // If no user, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return <Crud user={user} />;
};

export default Dashboard;
