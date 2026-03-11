"use client";

const isLocalStorageAvailable = typeof window !== "undefined";

// Helper to get the full user object
export const getUser = (): any => {
  if (!isLocalStorageAvailable) return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Set full user object
export const setUser = (user: any): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// Get individual properties
export const getEmail = (): string => getUser()?.email || "";
export const getUserID = (): string => (getUser()?._id || getUser()?.id || "");
export const getfullname = (): string => getUser()?.fullname || "";
export const getPhoneNumber = (): string => getUser()?.phoneNumber || "";
export const getUserName = (): string => getUser()?.username || "";
export const getRole = (): string => getUser()?.role || "";
export const getToken = (): string => getUser()?.token || "";

// Set individual properties (update existing user object)
export const setEmail = (email: string) => {
  const user = getUser() || {};
  setUser({ ...user, email });
};

export const setUserID = (id: string) => {
  const user = getUser() || {};
  setUser({ ...user, id });
};

export const setfullname = (fullname: string) => {
  const user = getUser() || {};
  setUser({ ...user, fullname });
};

export const setPhoneNumber = (phoneNumber: string) => {
  const user = getUser() || {};
  setUser({ ...user, phoneNumber });
};

export const setUserName = (username: string) => {
  const user = getUser() || {};
  setUser({ ...user, username });
};

export const setToken = (token: string) => {
  const user = getUser() || {};
  setUser({ ...user, token });
};

// Check authentication
export const isAuthenticated = (): boolean => !!getToken();

// Logout
export const handleLogout = (): void => {
  if (isLocalStorageAvailable) {
    localStorage.clear();
    window.location.href = "/sign-in";
  }
};
