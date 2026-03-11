"use client";
import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const FAQ = () => {
    const faqData = [
        {
          question: "How does E-Waygo help me find e-waste recycling facilities?",
          answer:
            "E-Waygo's intelligent facility locator uses technology to instantly identify certified e-waste recycling centers nearest to you. Simply access our interactive map interface, enter your location, and discover information about each facility designed to make responsible e-waste disposal effortless and convenient.",
        },
        {
          question: "How does E-Waygo verify the facilities listed on the platform?",
          answer:
            "We implement a verification process for all facilities on our platform. Each facility undergoes credential validation, certification verification, operational compliance checks, and monitoring. We also incorporate user feedback and regular audits to maintain the highest standards of accuracy and reliability—ensuring you can trust every facility recommendation we provide.",
        },
        {
          question: "Can I schedule the pickup and recycling of my e-waste through E-Waygo?",
          answer:
            "Absolutely! Our streamlined booking system allows you to schedule e-waste pickups with just a few clicks. Select your preferred facility, choose from available time slots, specify the type and quantity of e-waste, and receive immediate email confirmation.",
        },
      ];
      

  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index: any) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  return (
    <section className="faq-new md:mb-40">
      <Container >
        <Row>
          <Col>
            <h2 className="text-center text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-center text-gray-600 mb-8">Everything you need to know about E-Waygo and responsible e-waste management</p>
            <div className="mt-8 faq-grid">
              {faqData.map((item, index) => (
                <div
                  className={`faq-card-new mb-6 p-8 rounded-xl cursor-pointer ${
                    activeQuestion === index ? "active" : ""
                  }`}
                  key={index}
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center justify-between text-center gap-12">
                    <h4 className="text-2xl font-bold">
                      {item.question}
                      <span className="text-xl font-semibold ">
                        {activeQuestion === index ? (
                          <RiArrowDropUpLine />
                        ) : (
                          <RiArrowDropDownLine />
                        )}
                      </span>
                    </h4>
                  </div>
                  {activeQuestion === index && (
                    <div style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}>
                      <p className="text-xl mt-4 leading-relaxed" style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'normal', transform: 'scaleX(1)' }}>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQ;
