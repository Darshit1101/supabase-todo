import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Loader2, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'

const UpdatePassword = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [hasValidSession, setHasValidSession] = useState(false)
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    })
    const navigate = useNavigate()

    // Check if user came from reset email link
    useEffect(() => {
        const checkSession = async () => {
            try {
                // First check URL for access token (from email link)
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                if (accessToken && refreshToken) {
                    // Set session from URL parameters
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })

                    if (error) {
                        console.error('Session error:', error)
                        setError('Invalid or expired reset link. Please request a new one.')
                        setAuthLoading(false)
                        return
                    }

                    if (data.session) {
                        setHasValidSession(true)
                        // Clear URL hash for security
                        window.location.hash = ''
                    }
                } else {
                    // Check existing session
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session) {
                        setHasValidSession(true)
                    } else {
                        setError('No valid reset session found. Please request a new password reset.')
                    }
                }
            } catch (err) {
                console.error('Auth check error:', err)
                setError('Something went wrong. Please try again.')
            } finally {
                setAuthLoading(false)
            }
        }

        checkSession()
    }, [navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear errors when user starts typing
        if (error) setError(null)
    }

    const validatePasswords = () => {
        if (!passwords.password || !passwords.confirmPassword) {
            setError('Please fill in both password fields')
            return false
        }

        if (passwords.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return false
        }

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePasswords()) return

        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.updateUser({
                password: passwords.password
            })

            if (error) {
                throw error
            }

            setSuccess(true)
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)

        } catch (error) {
            console.error('Password update error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Reset Link...</h2>
                    <p className="text-gray-600">Please wait while we verify your password reset link.</p>
                </div>
            </div>
        )
    }

    if (error && !hasValidSession) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Updated!</h2>
                    <p className="text-gray-600 mb-4">
                        Your password has been successfully updated. Redirecting to dashboard...
                    </p>
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Update Password</h2>
                    <p className="text-gray-600 mt-2">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={passwords.password}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter new password (min 6 chars)"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwords.confirmPassword}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm new password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                disabled={loading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Updating Password...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:underline"
                        disabled={loading}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword
