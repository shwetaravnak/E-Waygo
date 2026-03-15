import React from "react";
import { FiSmartphone, FiHeadphones, FiTv } from "react-icons/fi";
import { GiWashingMachine } from "react-icons/gi";
import { RiFridgeFill } from "react-icons/ri";
import { FaLaptop } from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";
import Link from "next/link";
import Head from "next/head";

interface RecycleCardProps {
  itemName: string;
  description: string;
  recyclingProcess: string;
  specialInstructions: string;
  icon: React.ReactNode;
  benefits: string;
}

const Recycle: React.FC = () => {
  const recycleItems: RecycleCardProps[] = [
    {
      itemName: "Smartphone",
      description: "Responsibly recycle your outdated or non-functional smartphones and recover valuable materials while protecting the environment.",
      recyclingProcess:
        "Our certified process includes data wiping, component dismantling, precious metal recovery, and safe disposal of hazardous materials.",
      specialInstructions:
        "Back up and factory reset your device to remove personal data. Remove SIM cards and memory cards before recycling.",
      benefits: "Recycling one smartphone can recover enough precious metals to prevent mining 80 kg of earth.",
      icon: <FiSmartphone size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Laptop",
      description: "Give your old laptops and computers a sustainable afterlife through our specialized electronics recycling program.",
      recyclingProcess:
        "We implement secure data destruction, component disassembly, circuit board processing, and proper management of LCD screens and batteries.",
      specialInstructions: "Back up important files, perform a secure wipe of all storage drives, and remove any external batteries before recycling.",
      benefits: "Recycling laptops can recover 95% of materials including valuable metals like gold, silver, and rare earth elements.",
      icon: <FaLaptop size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Accessories",
      description: "Properly dispose of cables, chargers, headphones, keyboards, and other electronic accessories that accumulate over time.",
      recyclingProcess:
        "We meticulously sort accessories by material type, separate metal components, process plastic elements, and safely handle any hazardous materials.",
      specialInstructions: "Bundle similar accessories together for easier processing and ensure batteries are removed from wireless devices.",
      benefits: "Recycling accessories prevents toxic materials from entering landfills and reduces the need for virgin resource extraction.",
      icon: <FiHeadphones size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Television",
      description: "Ensure your old TVs, monitors, and display devices are recycled in an environmentally responsible manner.",
      recyclingProcess:
        "Our specialized process includes screen separation, hazardous material containment, circuit board recovery, and plastic/metal segregation for optimal recycling.",
      specialInstructions:
        "Transport with screen facing down to prevent shattering. Include all cables, stands, and remote controls when possible.",
      benefits: "Proper TV recycling prevents lead, mercury, and flame retardants from contaminating soil and water resources.",
      icon: <FiTv size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Refrigerator",
      description: "Dispose of refrigerators and freezers through our specialized large appliance recycling program that safely handles refrigerants.",
      recyclingProcess:
        "We carefully extract and properly dispose of refrigerants, recover insulation materials, separate and process metal components, and manage hazardous elements.",
      specialInstructions:
        "Clean and defrost the unit completely before recycling. Remove all food, shelving, and loose components.",
      benefits: "Proper refrigerator recycling prevents potent greenhouse gases from entering the atmosphere and recovers valuable metals and plastics.",
      icon: <RiFridgeFill size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Other",
      description: "Recycle any electronic device not covered by other categories through our comprehensive e-waste management program.",
      recyclingProcess:
        "Every device undergoes proper assessment, disassembly, component sorting, material recovery, and environmentally sound disposal of non-recyclable parts.",
      specialInstructions: "If possible, include original packaging, manuals, and accessories for the most complete recycling process.",
      benefits: "Ensures that even unusual or uncommon electronic devices are properly handled and don't end up in landfills.",
      icon: <MdOutlineDevicesOther size={48} className="text-emerald-500" />,
    },
  ];

  return (
    <>
      <Head>
        <title>E-Waygo - Electronics Recycling Solutions</title>
        <meta name="description" content="Responsibly recycle your electronic devices with EWaygo's specialized recycling programs for smartphones, laptops, TVs, refrigerators and more." />
      </Head>
    
      <div className="section container mx-auto px-4 recycle-container relative py-12">
        {/* Ambient background decoration */}
        <div className="absolute top-10 right-0 w-80 h-80 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="text-center mb-20 relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 drop-shadow-sm tracking-tight">
            Sustainable Electronics Recycling
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Choose the right recycling option for your electronic devices and contribute to a circular economy that preserves resources and protects our environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {recycleItems.map((item, index) => (
            <RecycleCard key={index} {...item} />
          ))}
        </div>
        
        <div className="mt-28 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-emerald-100/50 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 dark:bg-emerald-800 rounded-bl-full opacity-20 dark:opacity-10"></div>
          <div className="text-center mb-12 relative z-10">
            <h3 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">Why Recycle Electronics With <span className="text-emerald-600 dark:text-emerald-400">EWaygo?</span></h3>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg font-medium">Our comprehensive approach ensures responsible handling of your electronic waste</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-600 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Certified Process</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">All recycling follows strict environmental standards and compliance protocols</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-600 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:-rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Data Security</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Guaranteed destruction of personal data on all electronic devices</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-600 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Resource Recovery</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Maximum extraction of valuable materials from your electronic waste</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-600 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:-rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Effortless Process</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Simple booking system makes recycling your electronics quick and convenient</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const RecycleCard: React.FC<RecycleCardProps> = ({
  itemName,
  description,
  recyclingProcess,
  specialInstructions,
  benefits,
  icon,
}) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] dark:shadow-none rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 hover:-translate-y-2 group">
      <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/30 dark:to-teal-900/30 p-8 flex justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-200/40 dark:bg-emerald-800/40 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-emerald-50 dark:border-gray-600 relative z-10 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-900/50">
        <h3 className="text-2xl font-extrabold mb-3 text-gray-800 dark:text-gray-100">{itemName}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">{description}</p>
        
        <div className="mb-6 flex-grow space-y-5">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-50 dark:border-gray-600 shadow-sm">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span> Process
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{recyclingProcess}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-50 dark:border-gray-600 shadow-sm">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span> Instructions
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{specialInstructions}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-50 dark:border-gray-600 shadow-sm">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span> Impact
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{benefits}</p>
          </div>
        </div>
        
        <Link
          href={`/recycle/${itemName.toLowerCase()}`}
          className="mt-auto w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-center transition-all duration-300 inline-block shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02]"
        >
          Recycle {itemName} Now
        </Link>
      </div>
    </div>
  );
};

export default Recycle;
