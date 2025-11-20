import './App.css'
import { useEffect, useState, useRef, memo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { supabase } from './supabase/supabaseClient'
import { Loader2 } from 'lucide-react'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const syncedRef = useRef(false)

  // Get initial session + auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === "PASSWORD_RECOVERY") {
          window.location.href = "/reset-password"
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sync profile to DB
  useEffect(() => {
    if (!user || syncedRef.current) return
    syncedRef.current = true

    const syncProfile = async () => {
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "User"
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        email: user.email,
        avatar_url: avatarUrl,
      })
    }

    syncProfile()
  }, [user])

  // Loading UI
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
      <AppRoutes user={user} />
    </Router>
  )
}

export default memo(App)
