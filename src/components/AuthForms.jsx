import React, { useState } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import PasswordReset from './PasswordReset'
import EmailConfirmationInfo from './EmailConfirmationInfo'

const AuthForms = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [unconfirmedEmail, setUnconfirmedEmail] = useState(null)
    const [showEmailInfo, setShowEmailInfo] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear errors and unconfirmed email when user starts typing
        if (error) setError(null)
        if (success) setSuccess(null)
        if (unconfirmedEmail) setUnconfirmedEmail(null)
        if (showEmailInfo) setShowEmailInfo(false)
    }

    // Register function
    const handleRegister = async (e) => {
        e.preventDefault()

        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            })

            if (error) {
                throw error
            }

            if (data.user) {
                if (data.session) {
                    // User is automatically logged in (email confirmation disabled)
                    setSuccess('Registration successful! You are now logged in.')
                } else {
                    // Email confirmation required
                    setSuccess('Registration successful! Please check your email and click the confirmation link to verify your account before logging in.')
                    setShowEmailInfo(true)
                    setFormData({ fullName: '', email: '', password: '' })
                }
            }
        } catch (error) {
            console.error('Registration error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Login function
    const handleLogin = async (e) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (error) {
                throw error
            }

            // Success handled by auth state change in App.jsx
        } catch (error) {
            console.error('Login error:', error)

            // Better error messages
            if (error.message === 'Email not confirmed') {
                setError('Please check your email and click the confirmation link to verify your account before logging in. Check your spam folder if you don\'t see the email.')
                setUnconfirmedEmail(formData.email) // Store email for resend option
            } else if (error.message === 'Invalid login credentials') {
                setError('Invalid email or password. Please check your credentials and try again.')
            } else {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    // Resend confirmation email function
    const resendConfirmation = async () => {
        if (!unconfirmedEmail) return

        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: unconfirmedEmail,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`
                }
            })

            if (error) {
                throw error
            }

            setSuccess('Confirmation email sent! Please check your inbox.')
        } catch (error) {
            console.error('Resend error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            {showPasswordReset ? (
                <PasswordReset onBackToLogin={() => setShowPasswordReset(false)} />
            ) : (
                <>
                    {/* Toggle Buttons */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true)
                                setError(null)
                                setSuccess(null)
                                setUnconfirmedEmail(null)
                                setShowEmailInfo(false)
                                setFormData({ fullName: '', email: '', password: '' })
                            }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${isLogin
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(false)
                                setError(null)
                                setSuccess(null)
                                setUnconfirmedEmail(null)
                                setShowEmailInfo(false)
                                setFormData({ fullName: '', email: '', password: '' })
                            }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isLogin
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {isLogin
                                ? 'Sign in to your account'
                                : 'Fill in your details to get started'
                            }
                        </p>
                    </div>

                    {/* Email Confirmation Info */}
                    {showEmailInfo && <EmailConfirmationInfo />}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                            <p className="text-red-700 text-sm">{error}</p>
                            {unconfirmedEmail && error.includes('Email not confirmed') && (
                                <button
                                    type="button"
                                    onClick={resendConfirmation}
                                    disabled={loading}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline focus:outline-none disabled:opacity-50"
                                >
                                    Resend confirmation email
                                </button>
                            )}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Auth Form */}
                    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                        {/* Full Name - Only for Register */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={isLogin ? 'Enter your password' : 'Choose a password (min 6 chars)'}
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

                        {/* Forgot Password Link - Only for Login */}
                        {isLogin && (
                            <div className="flex justify-end mt-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordReset(true)}
                                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Sign in' : 'Create account'}
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}

export default AuthForms
