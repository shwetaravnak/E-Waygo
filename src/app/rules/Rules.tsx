/* eslint-disable react/no-unescaped-entities */
import React from "react";
const news: any[] = [];
const notifications: any[] = [];
const report: any[] = [];
import Head from "next/head";

type Props = {};

interface RuleCardProps {
  number: string;
  title: string;
  content: string;
  className?: string;
}

const RuleCard: React.FC<RuleCardProps> = ({ number, title, content, className = "" }) => (
  <div className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-all duration-300 group ${className}`}>
    <div className="flex items-start mb-3">
      <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 flex-shrink-0 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">{title}</h4>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content }}></p>
  </div>
);

const Rules = (props: Props) => {
  return (
    <>
    <Head>
      <title>E-Waygo - E-Waste Regulations & Compliance</title>
      <meta name="description" content="Stay informed about the latest e-waste management regulations in India. Access official notifications, industry news, and compliance requirements." />
    </Head>
    <div className="flex flex-col section container rules-container py-12">
      <div className="absolute top-10 left-0 w-80 h-80 bg-gradient-to-br from-emerald-300 to-teal-300 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-emerald-200 to-teal-200 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full mx-auto text-2xl px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 tracking-tight">
          Indian E-Waste Management Regulatory Framework
        </h2>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] dark:shadow-none border border-emerald-100/50 dark:border-gray-700 mb-10 transition-all hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
          <p className="mb-4 text-gray-800 dark:text-gray-200 text-xl flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
            <strong className="text-emerald-700 dark:text-emerald-400">Official Notification</strong>
          </p>
          <div className="space-y-2 text-gray-600 dark:text-gray-300 pl-5 border-l-2 border-emerald-200 dark:border-gray-600">
            <p className="font-medium">Ministry of Environment, Forest and Climate Change</p>
            <p className="text-sm">(EP Division)</p>
            <p className="font-medium">Dated the 16th March, 2022</p>
            <p className="font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded inline-block my-2 dark:bg-gray-700 dark:text-emerald-400">S.O. 1047(E)</p>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-lg mt-2">Subject: The E-Waste (Management) Rules, 2022</p>
          </div>
        </div>
        <p className="mb-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-4xl font-medium">
          In exercise of the powers conferred by section 6, 8 and 25 of the
          Environment (Protection) Act, 1986 (29 of 1986), the Central
          Government hereby establishes comprehensive guidelines for the responsible management,
          handling, and disposal of electronic waste across India:
        </p>

        <div className="mb-12 font-medium">
          <h3 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400 flex items-center">
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-inner text-lg">I</span>
            CHAPTER I: PRELIMINARY PROVISIONS
          </h3>

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 space-y-6">
            <div>
              <p className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                1. Short title and commencement.
              </p>
              <div className="pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <p>(1) These rules may be called the E-Waste (Management) Rules, 2022.</p>
                <p>(2) They shall come into force on the date of their publication in the Official Gazette.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                2. Definitions.
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-400 pl-5">
                In these rules, unless the context otherwise requires:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-5">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">"Act"</span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Means the Environment (Protection) Act, 1986 (29 of 1986)</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">"Appliance"</span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Means any electrical or electronic equipment that is designed for household use</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">"Authorized dismantler"</span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Means a person or entity authorized by the State Pollution Control Board to dismantle or disassemble e-waste</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 font-medium relative z-10">
          <h3 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400 flex items-center">
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-inner text-lg">II</span>
            CHAPTER II: PRODUCER RESPONSIBILITIES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RuleCard 
              number="3" 
              title="Extended producer responsibility." 
              content="(1) Every producer shall be responsible for establishing a system to collect, refurbish, recycle or dispose of e-waste generated from their products in an environmentally sound manner."
            />
            <RuleCard 
              number="4" 
              title="Collection of E-Waste from Consumers." 
              content="(1) Producers shall establish dedicated collection centers for the return of end-of-life electronic products from consumers.<br/><br/>(2) Producers shall provide comprehensive information to consumers regarding the location of collection centers and the procedures for returning end-of-life electronic products."
            />
            <RuleCard 
              number="5" 
              title="Recycling Targets." 
              content="(1) Producers shall achieve the specific recycling targets detailed in Schedule II of these rules.<br/><br/>(2) Producers failing to meet the established recycling targets shall be subject to financial penalties as determined by the Central Pollution Control Board."
            />
            <RuleCard 
              number="6" 
              title="Labeling of Electronic Products." 
              content="(1) All electronic products must be clearly labeled with information regarding environmentally hazardous substances contained within the product and the recommended safe disposal practices.<br/><br/>(2) The Central Pollution Control Board shall establish and enforce the required manner and form of labeling."
            />
            <RuleCard 
              number="7" 
              title="Annual Reporting Requirements." 
              content="(1) Producers shall submit comprehensive annual reports to the State Pollution Control Board detailing the collection and recycling of e-waste.<br/><br/>(2) The format and required details of these annual reports shall be specified by the Central Pollution Control Board."
            />
            <RuleCard 
              number="8" 
              title="Transportation and Handling." 
              content="(1) Producers and authorized dismantlers shall ensure safe and environmentally sound transportation and handling of e-waste materials.<br/><br/>(2) All vehicles used for transportation must fully comply with the guidelines provided by the Central Pollution Control Board."
            />
            <RuleCard 
              number="9" 
              title="Public Awareness Programs." 
              content="(1) Producers shall develop, organize and actively participate in awareness programs to educate consumers and the general public about the proper disposal of e-waste.<br/><br/>(2) These programs shall highlight the environmental impact of improper e-waste disposal and promote responsible recycling practices."
            />
            <RuleCard 
              number="10" 
              title="Prohibition of Unauthorized Handling." 
              content="(1) Unauthorized handling, including dismantling and recycling of e-waste, is strictly prohibited under these regulations.<br/><br/>(2) Violation of this rule may result in serious legal consequences, including substantial fines and penalties."
            />
            <RuleCard 
              number="11" 
              title="Collaboration with Authorized Facilities." 
              content="(1) Producers shall establish active collaboration with authorized treatment and disposal facilities for the environmentally safe processing of e-waste.<br/><br/>(2) All facilities must strictly comply with the standards established by regulatory authorities."
              className="md:col-span-2"
            />
          </div>
        </div>
      </div>
      <hr className="bg-emerald-200 dark:bg-emerald-800/50 mt-10 mb-14 p-[1px] border-none" />
      
      <div className="flex flex-col xl:flex-row w-full mx-auto gap-8 px-4 relative z-10">
        
        {/* Notifications Column */}
        <div className="flex flex-col w-full xl:w-1/3 my-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 py-4 border-b border-emerald-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 flex items-center">
             <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </span>
             Official Notifications
          </h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 max-h-[600px] overflow-y-auto stylish-scrollbar">
            {notifications.map((notification, index) => (
              <div key={index} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {notification.title}
                </h3>
                <a
                  href={notification.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold inline-flex items-center text-sm"
                >
                  View Document 
                  <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* News Column */}
        <div className="flex flex-col w-full xl:w-1/3 my-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 py-4 border-b border-emerald-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 flex items-center">
             <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
             </span>
             Industry Updates
          </h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 max-h-[600px] overflow-y-auto stylish-scrollbar">
            {news.map((notification, index) => (
              <div key={index} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 mb-2 uppercase tracking-wide">{notification.date}</p>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {notification.title}
                </h3>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{notification.content}</p>
                <a
                  href={notification.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold inline-flex items-center text-sm"
                >
                  Read Article 
                  <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reports Column */}
        <div className="flex flex-col w-full xl:w-1/3 my-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 py-4 border-b border-emerald-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 flex items-center">
             <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </span>
             Annual Reports
          </h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 max-h-[600px] overflow-y-auto stylish-scrollbar">
            {report.map((notification, index) => (
              <div key={index} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {notification.title}
                </h3>
                <a
                  href={notification.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold inline-flex items-center text-sm"
                >
                  Access Report 
                  <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="bg-emerald-200 dark:bg-emerald-800/50 mt-10 p-[1px] border-none" />
    </div>
    </>
  );
};

export default Rules;
