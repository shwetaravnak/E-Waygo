"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import feature from "../../assets/features/banner2.png";
import { useDarkMode } from "../utils/DarkModeContext";
import { getUser } from "../sign-in/auth";

const About = () => {
  const { isDarkMode } = useDarkMode();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);
  
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50" id="features" aria-label="features">
      {/* Background subtle decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative container mx-auto px-4 text-center z-10">
        <p className={`text-sm md:text-base font-bold tracking-widest uppercase mb-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
        —Discover E-Waygo—
        </p>

        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10 bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-emerald-300 to-teal-200' : 'from-emerald-700 to-teal-600'}`}>
        Pioneering the Future of E-Waste Management & Sustainability
        </h2>

        <div className="mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between text-center md:text-left">
            <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 relative group md:pr-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src={feature}
                alt="Sustainable E-Waste Management Solution"
                width={500}
                height={500}
                className="relative object-cover rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8">
              <p className={`text-lg md:text-xl md:leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                India faces a critical environmental challenge, generating 1.71 million metric tons of e-waste annually, much of which is improperly disposed of due to limited access to reliable and certified collection facilities. This lack of accessibility continues to accelerate the nation's growing e-waste crisis. <br /><br />
                E-Waygo was created to address this urgent need. Our platform bridges the gap between consumers and certified e-waste facilities through an intuitive and powerful interface. More than just a locator, E-Waygo drives responsible electronics lifecycle management and champions environmental stewardship—one device at a time.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start mt-8 gap-4">
                <Link href="/contactus" className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                  Connect With Us
                </Link>
                {(!user || user.role === 'user') && (
                  <Link href="/recycle" className="px-8 py-3 rounded-full bg-white text-emerald-600 border border-emerald-100 font-semibold shadow-md hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    Explore Recycling Solutions
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

