import React, { memo, useState } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

const Profile = ({ user }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const navigate = useNavigate()

    const fullName = user?.user_metadata?.full_name || "No name";
    const avatar = user?.user_metadata?.avatar_url || null;
    const email = user?.email;

    //delete account
    const handleDeleteAccount = async () => {
        try {
            setDeleteLoading(true)
            setDeleteError(null)

            // Delete user's todos first
            const { error: todosError } = await supabase
                .from('todos')
                .delete()
                .eq('user_id', user.id)

            if (todosError) {
                throw new Error('Failed to delete user data: ' + todosError.message)
            }

            // Delete profile
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', user.id)

            if (profileError) {
                console.warn('Profile deletion warning:', profileError.message)
            }

            // Sign out the user (account deletion requires server-side admin API)
            await supabase.auth.signOut()

            // Note: Actual user account deletion requires admin privileges
            // The user data has been cleaned up, but the auth account remains
            // In a production app, you would need to implement server-side deletion
            // or use a Supabase Edge Function with service role permissions

            navigate('/login')

        } catch (error) {
            console.error('Delete account error:', error)
            setDeleteError(error.message)
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6">
                {/* Profile Image */}
                <img
                    src={avatar}
                    referrerPolicy="no-referrer"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border"
                />

                {/* User Info */}
                <div>
                    <p className="text-lg font-semibold">{fullName}</p>
                    <p className="text-gray-600">{email}</p>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="bg-white p-6 rounded-lg shadow border border-red-100">
                <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h2>
                <p className="text-gray-600 mb-4">
                    This will permanently delete all your data (todos, profile) and sign you out.
                    Note: Your account login will remain active - contact support for complete account deletion.
                </p>

                {deleteError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-red-700 text-sm">{deleteError}</p>
                    </div>
                )}

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <h3 className="font-semibold text-red-800 mb-2">Are you absolutely sure?</h3>
                            <p className="text-red-700 text-sm">
                                This will permanently delete all your data and sign you out.
                                Your login credentials will remain - contact support for complete account deletion.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Yes, delete my data
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setDeleteError(null)
                                }}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Profile)
