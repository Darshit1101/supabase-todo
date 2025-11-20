import React, { useState } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

const PasswordReset = ({ onBackToLogin }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            setError('Please enter your email address')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const redirectUrl = `${window.location.origin}/reset-password`
            console.log('Sending reset email to:', email)
            console.log('Redirect URL:', redirectUrl)

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            })

            if (error) {
                throw error
            }

            setSuccess('Password reset email sent! Check your inbox and click the link.')
            setEmail('')
        } catch (error) {
            console.error('Password reset error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                <p className="text-gray-600 mt-2">
                    Enter your email address and we'll send you a link to reset your password
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-green-700 text-sm">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="reset-email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            disabled={loading}
                        />
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
                            Sending...
                        </>
                    ) : (
                        'Send Reset Email'
                    )}
                </button>
            </form>

            <button
                onClick={onBackToLogin}
                className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
            </button>
        </div>
    )
}

export default PasswordReset
