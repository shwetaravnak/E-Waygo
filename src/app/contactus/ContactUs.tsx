"use client";
import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  location,
  call,
  mail,
  logoLinkedin,
  logoTwitter,
  logoInstagram,
  logoWhatsapp,
} from "ionicons/icons";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save message");
      }

      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      // Try to send email notification, but do not fail the whole flow if it errors
      emailjs
        .send(
          "service_jqn5flv",
          "template_cnom5kj",
          templateParams,
          "ddYcz13MvW01UFF5u"
        )
        .then(() => {
          // no-op, already showing success toast below
        })
        .catch(() => {
          // warn but keep success for DB save
          toast.warn("Saved your message. Email notification couldn't be sent.");
        });

      setFormData({ name: "", email: "", phone: "", message: "" });
      toast.success("Message saved! Our team will respond shortly.");
    } catch (err: any) {
      toast.error(err?.message || "We encountered an issue. Please try again.");
    }
  };

  return (
    <>
    <Head>
     <title>E-Waygo - Connect With Our Sustainability Experts</title>
     <meta name="description" content="Have questions about e-waste management or our platform? Get in touch with EWaygo's dedicated team for personalized assistance and information." />
    </Head>
    
    <div className="px-4 w-full py-16 lg:py-24 md:pb-32 container mx-auto contactus-container relative transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-200 to-teal-300 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-300 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none"></div>

      <ToastContainer
        className="text-base"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />

      <div className="flex flex-col items-center justify-center px-4 md:px-10 relative z-10 w-full max-w-4xl mx-auto">
        <p className="text-emerald-600 font-bold text-sm md:text-base uppercase tracking-widest mb-3">
          —Connect With Us—
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 text-center drop-shadow-sm mb-6 pb-2">
          Partner with us in building a sustainable future.
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg md:text-xl font-medium leading-relaxed">
          Whether you have questions about our services, want to suggest a recycling facility, or need assistance with e-waste management, our dedicated team is here to help you make environmentally responsible choices.
        </p>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-10 mt-16 max-w-6xl mx-auto">
          {/* Section for sending a message */}
          <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-emerald-50 dark:border-gray-700 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-500"></div>
            <h3 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 pl-4">
              Reach Out to Our Team
            </h3>
            <form
              className="w-full pl-4"
              onSubmit={SendMsg}
            >
              <div className="mb-5 ">
                <label
                  htmlFor="name"
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm uppercase tracking-wide"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-700 dark:text-gray-200 font-medium"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-700 dark:text-gray-200 font-medium"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm uppercase tracking-wide"
                >
                  Phone Number
                </label>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-700 dark:text-gray-200 font-medium"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm uppercase tracking-wide"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-700 dark:text-gray-200 resize-none font-medium"
                  placeholder="How can we assist with your e-waste management needs?"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-center transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transform text-lg"
              >
                Send Your Message
              </button>
            </form>
          </div>

          {/* Section for contact information */}
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Decorative background for the second card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-emerald-400/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/40 dark:bg-black/40 rounded-full -ml-20 -mb-20 blur-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold mb-10 text-white">
                Direct Contact Information
              </h3>
            </div>
            <ul className="space-y-8 relative z-10">
              <li className="flex items-start group">
                <div className="bg-white/20 p-3 rounded-2xl mr-4 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <IonIcon icon={location} aria-hidden="true" className="w-7 h-7 text-white"></IonIcon>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-white/90">Our Location</h4>
                  <address className="not-italic text-white/70 font-medium">
                    Main Office: ABC,<br />Maharashtra, India 
                  </address>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white/20 p-3 rounded-2xl mr-4 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <IonIcon icon={call} aria-hidden="true" className="w-7 h-7 text-white"></IonIcon>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-white/90">Phone Support</h4>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="tel:+911234567890"
                    className="text-white hover:text-emerald-200 font-medium transition-colors"
                  >
                    +91 123 456 7890
                  </Link>
                  <p className="text-sm text-white/60 mt-1">Mon-Fri: 9AM to 6PM IST</p>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white/20 p-3 rounded-2xl mr-4 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <IonIcon icon={mail} aria-hidden="true" className="w-7 h-7 text-white"></IonIcon>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-white/90">Email Us</h4>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="mailto:contact@EWaygo.com"
                    className="text-white hover:text-emerald-200 font-medium transition-colors"
                  >
                    contact@EWaygo.com
                  </Link>
                  <p className="text-sm text-white/60 mt-1">We respond within 24 hours</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
              <h4 className="font-bold text-lg mb-6 text-center text-white/90 uppercase tracking-widest">Connect on Social Media</h4>
              <ul className="flex justify-center space-x-6">
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/"
                      aria-label="Connect with EWaygo on LinkedIn"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <IonIcon icon={logoLinkedin} className="w-6 h-6"></IonIcon>
                    </Link>
                  </li>
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/"
                      aria-label="Follow EWaygo on Instagram"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <IonIcon icon={logoInstagram} className="w-6 h-6"></IonIcon>
                    </Link>
                  </li>
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/"
                      aria-label="Follow EWaygo on Twitter"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <IonIcon icon={logoTwitter} className="w-6 h-6"></IonIcon>
                    </Link>
                  </li>
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/"
                      aria-label="Contact EWaygo on WhatsApp"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <IonIcon icon={logoWhatsapp} className="w-6 h-6"></IonIcon>
                    </Link>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
