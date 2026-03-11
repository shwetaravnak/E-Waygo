"use client";
import React, { useEffect, useState } from "react";
import Home from "./Components";

export default function App() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role);
    } else {
      setRole(null);
    }
  }, []);

  return <Home />;
}
