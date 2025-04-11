import React from 'react';

const CompanyPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1>Welcome to Our Company</h1>
        <p>We are committed to delivering excellence.</p>
      </header>
      <section>
        <h2>About Us</h2>
        <p>
          Our company specializes in providing top-notch solutions to meet your
          business needs. With a team of dedicated professionals, we ensure
          quality and innovation in everything we do.
        </p>
      </section>
      <section>
        <h2>Our Services</h2>
        <ul>
          <li>Consulting</li>
          <li>Software Development</li>
          <li>Project Management</li>
        </ul>
      </section>
      <footer
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} Our Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CompanyPage;
