import React, { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

function Profile() {
  const profile = useContext(ProfileContext);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">
        {/* Profile Image */}
        <img
          src={profile?.image}
          alt={profile?.name}
          className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500"
        />

        {/* Name & Role */}
        <h2 className="mt-4 text-xl font-bold text-gray-800">{profile?.name}</h2>
        <p className="text-sm text-gray-500 capitalize">{profile?.roll}</p>

        {/* Email */}
        <p className="mt-2 text-gray-600">{profile?.email}</p>

        {/* Action Button */}
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
