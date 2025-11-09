

import { createContext, useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    const fetchUser = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

    const accessToken = localStorage.getItem("token");

    
    const userData = { ...response.data, token: accessToken };

    setUser(userData);
  } catch (error) {
    console.error("User not authenticated", error);
    clearUser();
  } finally {
    setLoading(false);
  }
};


    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
