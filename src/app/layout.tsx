import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import { DarkModeProvider } from "./utils/DarkModeContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "E-Waygo",
  description: "E-Waygo - One stop solution to Recycle E-Waste, E-waste Facility Locator",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-5QLTMJKRNP"
      ></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQV05PLN3T');
            `,
        }}
      />

      <body className={`${poppins.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <DarkModeProvider>
          <NextTopLoader color="#28af60" showSpinner={false} />
          <Navbar />
          {children}
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
