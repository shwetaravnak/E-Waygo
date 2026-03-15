"use client";
import React from "react";
import { motion } from "framer-motion";
import ResetPassword from "./ResetPassword";

const Page = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-8 md:mt-16 md:pt-8">
          <ResetPassword />
        </div>
      </motion.div>
    </React.Suspense>
  );
};

export default Page;
