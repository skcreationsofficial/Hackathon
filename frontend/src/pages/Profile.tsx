import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";
import Layout from "../components/Layout/Layout";
import moment from "moment";
import LoaderSpinner from "../components/Header/LoadingSpinner"; // ✅ LoaderSpinner import

const sidebarLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
  { label: "History", path: "/booking-history" },
  { label: "Reports", path: "/reports" },
];

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<any>({email: "", mobileNumber: "", profilePicture: "https://randomuser.me/api/portraits/men/45.jpg", profile: {dob: "", age: ""}});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = ""; // Replace with actual user ID or retrieve from context/localStorage/etc.

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/profile/${userId}`
        );
        // setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[300px]">
        <LoaderSpinner /> {/* ✅ Replaces "Loading..." */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-6">
        <Card className="w-full sm:w-1/2 md:w-1/3">
          <div className="flex flex-col items-center">
            <img
              src={
                profileData.profilePicture ||
                "https://randomuser.me/api/portraits/men/45.jpg"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {profileData.username}
            </h2>
            <p className="text-gray-600">{profileData.email}</p>
            <p className="text-gray-600">{profileData.mobileNumber}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Bio</h3>
          <p className="text-gray-600">
            Age: {profileData.profile.age || "Not available"}
          </p>
          <p className="text-gray-600">
            DOB: {moment(profileData.profile.dob).format("MM/DD/YYYY")}
          </p>
        </Card>

        <Card className="col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Information
          </h3>
          <p className="text-gray-600">Email: {profileData.email}</p>
          <p className="text-gray-600">Phone: {profileData.mobileNumber}</p>
        </Card>

        

      </div>
    </div>
  );
};

export default Profile;