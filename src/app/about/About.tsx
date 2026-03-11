import Image from "next/image";
import Link from "next/link";
import React from "react";
import feature from "../../assets/features/banner.svg";
import { useDarkMode } from "../utils/DarkModeContext";

const About = () => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <section className="section features" id="features" aria-label="features">
      <div className="container mx-auto px-4 text-center">
        <p className={`section-subtitle font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        —Discover E-Waygo—
        </p>

        <h2 className={`text-4xl section-title font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Pioneering the Future of E-Waste Management & Sustainability
        </h2>

        <div className=" mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between text-center md:text-left">
            <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8">
              <p className={`section-text text-3xl font-semibold leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                India faces a critical environmental challenge, generating 1.71 million metric tons of e-waste annually, much of which is improperly disposed of due to limited access to reliable and certified collection facilities. This lack of accessibility continues to accelerate the nation's growing e-waste crisis. <br /><br />
                E-Waygo was created to address this urgent need. Our platform bridges the gap between consumers and certified e-waste facilities through an intuitive and powerful interface. More than just a locator, E-Waygo drives responsible electronics lifecycle management and champions environmental stewardship—one device at a time.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start mt-6">
                <p className="btn btn-primary mr-3">
                  <Link href="/contactus">Connect With Us</Link>
                </p>
                <p className="btn btn-secondary mr-3">
                  <Link href="/recycle">Explore Recycling Solutions</Link>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center section-banner has-before">
              <Image
                src={feature}
                alt="Sustainable E-Waste Management Solution"
                width={400}
                height={400}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

