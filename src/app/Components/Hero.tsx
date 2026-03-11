"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import hero from "../../assets/hero-banner.png";

const solutions = [
  "Recycling Revolution",
  "Sustainable Disposal",
  "Smart Facility Finder",
];

const solutionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const HeroSection: React.FC = () => {
  const [currentSolution, setCurrentSolution] = useState(solutions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = solutions.indexOf(currentSolution);
      const nextIndex = (currentIndex + 1) % solutions.length;
      setCurrentSolution(solutions[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSolution]);

  return (
    <section className="hero-new" id="home" aria-label="hero">
      {/* Decorative floating circles */}
      <div className="hero-decoration hero-decoration-1"></div>
      <div className="hero-decoration hero-decoration-2"></div>
      <div className="hero-decoration hero-decoration-3"></div>
      
      <div className="container mx-auto px-4">
        <div className="hero-grid">
          {/* Content Side */}
          <div className="hero-content-new">
            <p className="mb-4 hero-subtitle-new">
              Welcome to E-Waygo — Where E-Waste Meets Responsibility
            </p>

            <h1 className="h1 hero-title-new font-bold mb-6">
              Your Partner in Smart and Sustainable E-Waste Solutions 
              <br /> 
              <motion.span
                className="text-go-green pt-2"
                variants={solutionVariants}
                initial="initial"
                animate="animate"
                key={currentSolution}
              >
                E-Waste {currentSolution}
              </motion.span>
            </h1>

            <p className="text-gray-700 mb-8">
              E-Waygo revolutionizes e-waste management through smart technology. 
              Discover nearby recycling facilities effortlessly and take a step toward responsible disposal and environmental care—one device at a time.
            </p>

            <div className="flex flex-row md:flex-row items-center justify-center md:justify-start sm:space-y-0 md:space-x-4 mb-10">
              <Link href="/e-facilities" className="btn btn-primary mr-4">
                Find Nearest Facility
              </Link>
              <Link href="/recycle" className="btn btn-primary mr-4">
                Start Recycling Today
              </Link>
            </div>
          </div>

          {/* Image Side */}
          <div className="hero-image-new">
            <div className="hero-image-wrapper">
              <Image
                src={hero}
                alt="hero banner"
                width={650}
                height={650}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

