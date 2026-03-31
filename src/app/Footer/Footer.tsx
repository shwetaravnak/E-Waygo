"use client";
import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { paperPlane } from "ionicons/icons";
import { location } from "ionicons/icons";
import { call } from "ionicons/icons";
import { mail } from "ionicons/icons";
import { logoLinkedin } from "ionicons/icons";
import { logoTwitter } from "ionicons/icons";
import { logoInstagram } from "ionicons/icons";
import { logoWhatsapp } from "ionicons/icons";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../utils/DarkModeContext";

const Footer = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  // Get dark mode context
  const { isDarkMode } = useDarkMode();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    } as Pick<typeof formData, keyof typeof formData>);
    ;
  };

  return (
    <footer className="footer projects shadow-2xl">
      <div className="footer-top md:section">
        <ToastContainer
          className="text-2xl"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <div className="container">
          <div className="footer-brand">
            <Link href="/">
              <span className="logo font-semibold text-4xl md:text-5xl mx-auto md:mx-0 flex items-center h-[100px] mb-4 drop-shadow-sm">
                <span className="text-blue-500 dark:text-blue-400">E-</span>
                <span className="text-green-500 dark:text-green-400">Waygo</span>
              </span>
            </Link>
            <p className="footer-text">
              E-Waygo revolutionizes e-waste management through smart technology. Discover nearby recycling facilities effortlessly and take a step toward responsible disposal and environmental care—one device at a time.
            </p>
          </div>
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Recycling Solutions</p>
            </li>
            <li>
              <Link href="/recycle/smartphone" className="footer-link">
                Smartphone Recycling
              </Link>
            </li>
            <li>
              <Link href="/recycle/laptop" className="footer-link">
                Laptop & Computer Recycling
              </Link>
            </li>
            <li>
              <Link href="/recycle/accessories" className="footer-link">
                Electronics Accessories
              </Link>
            </li>

            <li>
              <Link href="/recycle/television" className="footer-link">
                Television & Display Recycling
              </Link>
            </li>

            <li>
              <Link href="/recycle/refrigerator" className="footer-link">
                Refrigerator & Cooling Appliances
              </Link>
            </li>

            <li>
              <Link href="/recycle/other" className="footer-link">
                Other Household Appliances
              </Link>
            </li>


          </ul>
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">E-Waygo Platform</p>
            </li>
            <li>
              <Link href="/about" className="footer-link">
                Our Mission & Vision
              </Link>
            </li>

            <li>
              <Link href="/e-facilities" className="footer-link">
                Certified Recycling Network
              </Link>
            </li>

            <li>
              <Link href="/contactus" className="footer-link">
                Get In Touch
              </Link>
            </li>
          </ul>
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Connect With Us</p>
            </li>
            <li className="footer-item">
              <IonIcon icon={location} aria-hidden="true" className="w-8 h-8 mt-4"></IonIcon>
              <address className="contact-link address">
                ABC,<br />Maharashtra, India
              </address>
            </li>
            <li className="footer-item">
              <IonIcon icon={call} aria-hidden="true"></IonIcon>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="tel:+911234567890"
                className="contact-link"
              >
                +91 123 456 7890
              </Link>
            </li>
            <li className="footer-item">
              <IonIcon icon={mail} aria-hidden="true"></IonIcon>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:contact@ewaygo.com"
                className="contact-link"
              >
                contact@ewaygo.com
              </Link>
            </li>
            <li className="footer-item">
              <ul className="social-list mb-4 md:mb-0">
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#"
                    aria-label="Connect with E-Waygo on LinkedIn"
                    className="social-link"
                  >
                    <IonIcon icon={logoLinkedin}></IonIcon>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#"
                    aria-label="Follow E-Waygo on Instagram"
                    className="social-link"
                  >
                    <IonIcon icon={logoInstagram}></IonIcon>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#"
                    aria-label="Follow E-Waygo on Twitter"
                    className="social-link"
                  >
                    <IonIcon icon={logoTwitter}></IonIcon>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#"
                    aria-label="Contact E-Waygo on WhatsApp"
                    className="social-link"
                  >
                    <IonIcon icon={logoWhatsapp}></IonIcon>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2025 E-Waygo | All Rights Reserved by{" "}
            <Link href="#" className="copyright-link">
              Team ABC
            </Link>
          </p>
          <ul className="footer-bottom-list">
            <li>
              <Link href="/privacypolicy" className="footer-bottom-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/termsandservices" className="footer-bottom-link">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
