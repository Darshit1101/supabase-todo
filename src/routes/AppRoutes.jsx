import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../pages/Header";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import UpdatePassword from "../pages/UpdatePassword";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = ({ user }) => {
  return (
    <Routes>
      {/* Header wrapper */}
      <Route path="/" element={<Header user={user} />}>

        {/* Redirect root */}
        <Route
          index
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Public route */}
        <Route path="login" element={<LoginPage user={user} />} />

        {/* Password Reset Route */}
        <Route path="reset-password" element={<UpdatePassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="profile" element={<Profile user={user} />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;