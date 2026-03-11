"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { menuOutline, closeOutline, location, sunny, moon } from "ionicons/icons";
import logo from "../../assets/E-Waygo .png";
import { getUser, handleLogout } from "../sign-in/auth";
import { useDarkMode } from "../utils/DarkModeContext";

interface NavItemProps {
  label: string;
}

const Header = () => {
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [locations, setLocation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // ✅ Ensure code runs only on client
  useEffect(() => {
    setIsClient(true);
    setUser(getUser());
  }, []);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // ✅ Geolocation inside client check
  useEffect(() => {
    if (!isClient) return;

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${token}`
          )
            .then((response) => response.json())
            .then((data) => {
              const city = data.features[0].context.find((c: any) =>
                c.id.includes("place")
              )?.text;
              const state = data.features[0].context.find((c: any) =>
                c.id.includes("region")
              )?.text;
              setLocation(`${city}, ${state}`);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        },
        (error) => {
          console.error(error);
        },
        options
      );
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsHeaderActive(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  const toggleNavbar = () => {
    setIsNavbarActive(!isNavbarActive);
  };

  return (
    <header className={`header ${isHeaderActive ? "active" : ""} ${isDarkMode ? "dark" : ""}`} data-header>
      <div className={`container shadow-md ${isDarkMode ? "dark:bg-gray-800" : ""}`}>
        <Link href="/">
          <Image
            src={logo}
            alt="EWaygo"
            width={100}
            height={100}
            className="logo ml-4 logo md:ml-16"
          />
        </Link>

        <nav className={`navbar ${isNavbarActive ? "active" : ""}`} data-navbar>
          <div className="wrapper">
            <Link href="/" className="logo">
              E-Waygo
            </Link>
            <button
              className="nav-close-btn"
              aria-label="close menu"
              onClick={toggleNavbar}
            >
              <IonIcon icon={closeOutline}></IonIcon>
            </button>
          </div>

          <ul className="navbar-list">
            <NavItem label="Home" />
            <NavItem label="About" />
            <NavItem label="E-Facilities" />
            <NavItem label="Recycle" />
            <NavItem label="Contact Us" />
            {user?.role === 'admin' && <NavItem label="Dashboard" />}
            {user?.role === 'ewaste_center' && <NavItem label="Users Requests" />}
            {user && <NavItem label="My Bookings" />}
            <NavItem label="Rules" />
          </ul>
        </nav>

        {/* ✅ Only render location once hydrated */}
        {isClient && (
          <h1 className="font-montserrat font-bold text-xl ml-12 md:ml-4 md:text-2xl text-emerald-600 flex items-center gap-[1vh]">
            <IonIcon icon={location}></IonIcon>
            {locations || "Loading..."}
          </h1>
        )}

        {/* ✅ Only render user info once hydrated */}
        {isClient && user ? (
          <div className="relative">
            <button
              className={`md:mr-8 text-sm md:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              onClick={handleToggleDropdown}
            >
              {(user?.fullname?.charAt(0)?.toUpperCase() ?? '') + (user?.fullname?.slice(1) ?? '')}
            </button>
            {isDropdownOpen && (
              <div className={`absolute top-12 right-0 p-4 shadow-md divide-y rounded-lg w-44 mt-2 ${isDarkMode ? 'bg-gray-800 dark' : 'projects bg-white'}`}>
                {user?.role !== 'admin' && (
                  <Link href="/profile" className={`block py-2 hover:text-emerald-500 ${isDarkMode ? 'text-gray-200' : ''}`}>
                    Profile
                  </Link>
                )}
                <button
                  className={`block py-2 w-full text-left hover:text-emerald-500 ${isDarkMode ? 'text-gray-200' : ''}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          isClient && (
            <Link href="/sign-in" className="btn-md btn-outline md:mr-4">
              SignIn
            </Link>
          )
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 md:mr-4"
          aria-label="Toggle dark mode"
        >
          <IonIcon 
            icon={isDarkMode ? sunny : moon} 
            className="text-xl text-emerald-600 dark:text-yellow-400"
          ></IonIcon>
        </button>

        <button
          className="nav-open-btn"
          aria-label="open menu"
          onClick={toggleNavbar}
        >
          <IonIcon icon={menuOutline}></IonIcon>
        </button>

        <div
          className={`overlay ${isNavbarActive ? "active" : ""}`}
          onClick={toggleNavbar}
        ></div>
      </div>
    </header>
  );
};

const NavItem = ({ label }: NavItemProps) => {
  let href = "/";
  if (label === "Home") href = "/";
  else if (label === "Users Requests") href = "/users-requests";
  else if (label === "Dashboard") href = "/admin";
  else if (label === "E-Facilities") href = "/e-facilities";
  else if (label === "Contact Us") href = "/contactus";
  else if (label === "My Bookings") href = "/my-bookings";
  else href = `/${label.toLowerCase()}`;

  return (
    <li className="navbar-link">
      <Link href={href}>
        {label}
      </Link>
    </li>
  );
};

export default Header;
