import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Axios default baseURL
  axios.defaults.baseURL = "http://localhost:5000";

  // Set Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

// Fetch all lecturers from backend
const fetchLecturers = async () => {
  try {
    const response = await axios.get("/lecturers");
    return response.data; // Array of lecturer objects
  } catch (err) {
    console.error("Error fetching lecturers:", err.response?.data || err.message);
    return [];
  }
};


  // Fetch logged-in user profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/profile");
      setUser({ ...response.data, token });
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
      logout(); // remove invalid token
    } finally {
      setLoading(false);
    }
  };



  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setUser({ ...userData, token: newToken });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await axios.post("/register", userData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchLecturers }}>
      {children}
    </AuthContext.Provider>
  );
};
