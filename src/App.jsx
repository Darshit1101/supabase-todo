import './App.css'
import { useEffect, useState, useRef, memo } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase/supabaseClient'
import { Loader2 } from 'lucide-react'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Profile from './components/Profile'
import UpdatePassword from './components/UpdatePassword'
import ProtectedLayout from './components/ProtectedRoute'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle password recovery
        if (event === 'PASSWORD_RECOVERY') {
          // User clicked reset link, redirect to reset password page
          window.location.href = '/reset-password'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sync user profile to profiles table when user logs in
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!user || syncedRef.current) return;
    syncedRef.current = true;

    const syncProfile = async () => {
      // For OAuth users, use user_metadata; for email/password users, use the email and any user_metadata
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        email: user.email,
        avatar_url: avatarUrl
      });
    };

    syncProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
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

          {/* Password Reset Route - Public but requires session from email link */}
          <Route path="reset-password" element={<UpdatePassword />} />

          {/* Protected Layout Start */}
          <Route element={<ProtectedLayout user={user} />}>

            <Route path="dashboard" element={<Dashboard user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />

          </Route>
          {/* Protected Layout End */}

        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );

}

export default memo(App)
