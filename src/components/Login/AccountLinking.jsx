import React, { useState } from 'react'
import { supabase } from '../../supabase/supabaseClient'
import { Loader2, LinkIcon, AlertCircle } from 'lucide-react'

const AccountLinking = ({ email, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [step, setStep] = useState('info') // 'info', 'reset', 'success'

    // Send password reset email to link OAuth account
    const linkAccountWithPassword = async () => {
        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            })

            if (error) {
                throw error
            }

            setStep('success')
        } catch (error) {
            console.error('Account linking error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            {step === 'info' && (
                <>
                    <div className="flex items-center mb-4">
                        <LinkIcon className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Account Already Exists
                        </h3>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    An account with <strong>{email}</strong> already exists and was created using Google/GitHub login.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                            You have two options:
                        </h4>
                        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                            <li>Continue using Google/GitHub to sign in</li>
                            <li>Set up a password for email/password login</li>
                        </ol>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={linkAccountWithPassword}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Setting up password...
                                </>
                            ) : (
                                'Set up Password for Email Login'
                            )}
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Continue with Google/GitHub
                        </button>
                    </div>
                </>
            )}

            {step === 'success' && (
                <>
                    <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <LinkIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Password Setup Email Sent!
                        </h3>
                        <p className="text-sm text-gray-600">
                            We've sent a password setup link to <strong>{email}</strong>.
                            Click the link in your email to set up a password for email/password login.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> After setting up your password, you'll be able to login using either:
                        </p>
                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                            <li>Email & Password</li>
                            <li>Google/GitHub OAuth (same as before)</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Got it!
                    </button>
                </>
            )}
        </div>
    )
}

export default AccountLinking
