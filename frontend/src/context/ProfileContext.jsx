import { useEffect, useState, createContext } from "react";
import api from "../api/api";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  async function getProfile() {
    try {
      const response = await api.get("/user/profile");
      setProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
  useEffect(() => {
    getProfile();

    const refreshProfile = () => getProfile();
    window.addEventListener("authChange", refreshProfile);

    return () => {
      window.removeEventListener("authChange", refreshProfile);
    };
  }, []); 

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};
