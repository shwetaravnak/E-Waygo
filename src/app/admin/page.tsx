"use client";
import React from "react";
import { motion } from "framer-motion";
import Admin from "./Admin";

const Page = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Admin />
    </motion.div>
  );
};

export default Page;