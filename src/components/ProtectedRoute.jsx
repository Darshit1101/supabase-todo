import { Navigate, Outlet } from "react-router-dom";
import { memo } from 'react';

const ProtectedLayout = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default memo(ProtectedLayout);
