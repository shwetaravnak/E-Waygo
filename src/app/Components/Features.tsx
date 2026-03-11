import React from "react";
import AboutUs from "../about/About";

const EWaygoFeatures = [
  {
    number: "01",
    title: "State-of-the-Art E-Waste Collection Network",
    description:
      "Access our extensive network of verified and certified e-waste collection facilities, ensuring safe, responsible, and environmentally-conscious disposal for all electronic devices.",
  },
  {
    number: "02",
    title: "Comprehensive Educational Resources",
    description:
      "Empower yourself with our knowledge hub containing expert insights, best practices, and the latest research on e-waste management and environmental sustainability.",
  },
  {
    number: "03",
    title: "Intuitive User Experience",
    description:
      "Navigate our sophisticated yet user-friendly platform designed for individuals, businesses, and organizations seeking efficient and effective e-waste solutions.",
  },
  {
    number: "04",
    title: "Advanced Facility Management Dashboard",
    description:
      "For facility owners: gain access to our comprehensive management suite with real-time analytics, booking oversight, and integrated credit tracking—all in one streamlined interface.",
  },
];

const Features: React.FC = () => {
  return (
    <>
      <section className="features-new" id="features" aria-label="features">
        <div className="container mx-auto px-4 pb-4 text-center">
          <AboutUs />
          <ul className="grid-list section py-20 my-2 features-grid">
            {EWaygoFeatures.map((feature, index) => (
              <li key={index}>
                <div className="features-card-new">
                  <data className="card-number" value={feature.number}>
                    {feature.number}
                  </data>
                  <h3 className="h3 card-title">{feature.title}</h3>
                  <p className="card-text text-2xl">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Features;
