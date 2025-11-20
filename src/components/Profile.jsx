import React, { memo } from 'react'

const Profile = ({ user }) => {
    console.log("Profile user:", user?.user_metadata?.avatar_url);
    const fullName = user?.user_metadata?.full_name || "No name";
    const avatar = user?.user_metadata?.avatar_url || null;
    const email = user?.email;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6">

                {/* Profile Image */}
                <img
                    src={avatar || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border"
                />

                {/* User Info */}
                <div>
                    <p className="text-lg font-semibold">{fullName}</p>
                    <p className="text-gray-600">{email}</p>
                </div>

            </div>
        </div>
    )
}

export default memo(Profile)
