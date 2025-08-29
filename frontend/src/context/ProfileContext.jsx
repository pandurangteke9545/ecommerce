// import { useEffect, useState, createContext } from "react";
// import api from "../api/api";

// export const ProfileContext = createContext();

// export const ProfileProvider = ({ children }) => {
//   const [profile, setProfile] = useState({});

//   async function getProfile() {
//     try {
//       const response = await api.get("/user/profile");
//       setProfile(response.data.data);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     }
//   }
//   useEffect(() => {
//     getProfile();

//     const refreshProfile = () => getProfile();
//     window.addEventListener("authChange", refreshProfile);

//     return () => {
//       window.removeEventListener("authChange", refreshProfile);
//     };
//   }, []); 

//   return (
//     <ProfileContext.Provider value={profile}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };



import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading , setLoading] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Fetch fresh profile from backend
  async function fetchProfile() {
    try {
      setLoading(true)
      const response = await api.get("/user/profile"); // token is sent via headers
      const freshProfile = response.data.data;
      setProfile(freshProfile);

      // update localStorage too
      localStorage.setItem("profile", JSON.stringify(freshProfile));
    } catch (error) {
      console.error("Error fetching profile:", error);
      // if token expired → clear profile
      setProfile(null);
      localStorage.removeItem("profile");
    }
    finally{
      setLoading(true)
    }
  }

  useEffect(() => {
    fetchProfile();

    // custom event listener for login/logout refresh
    const refreshProfile = () => fetchProfile();
    window.addEventListener("authChange", refreshProfile);

    return () => {
      window.removeEventListener("authChange", refreshProfile);
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile}}>
      {children}
    </ProfileContext.Provider>
  );
};
