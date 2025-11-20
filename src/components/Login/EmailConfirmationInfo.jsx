import React from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

const EmailConfirmationInfo = () => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">
                        Email Verification Required
                    </h3>
                    <div className="text-sm text-blue-700 space-y-2">
                        <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <span>Check your email inbox for a confirmation message</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <span>Click the confirmation link to verify your account</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <span>Check your spam/junk folder if you don't see the email</span>
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                        After confirming your email, return to this page to log in.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailConfirmationInfo
