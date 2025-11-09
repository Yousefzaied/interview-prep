
import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const ProfileInfoCard = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading...</div>;
  }

  if (!user) {
    return <div className="text-gray-500 text-sm">No user</div>;
  }

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";
  const profileImageUrl = user.profileImageUrl;

  return (
    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover border border-gray-300"
        />
      ) : (
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white text-base font-semibold">
          {firstLetter}
        </div>
      )}

      <span className="text-sm font-medium text-gray-800">{user.name}</span>
    </div>
  );
};

export default ProfileInfoCard;

