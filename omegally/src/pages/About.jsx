import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="container">
      <div className="about-container">
        <h1 className="about-title">About Omegally</h1>
        <p className="about-description">
          Omegally is a youth-focused ecommerce platform that lets you <span className="about-highlight">shop now and pay later</span> in flexible installments. 
          We believe in making the latest tech accessible to everyone, without the financial stress.
        </p>
        <p className="about-description">
          Founded in 2025, we've helped thousands of customers get the products they love with 
          <span className="about-highlight"> 0% interest</span> installment plans. Our mission is to empower the next generation 
          of consumers with smart, flexible payment options.
        </p>
      </div>
    </div>
  );
};

export default About;