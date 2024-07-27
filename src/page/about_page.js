import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/about.css'; // Import your custom CSS file
import useDocumentTitle from '../utils/useDocumentTitles';

const AboutPage = () => {

  useDocumentTitle('About Us - RGreement');
  return (
    <div className="about-container">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h1 className="card-title text-center mb-4">About Us</h1>
              <p className="card-text lead text-justify">
                Welcome to our platform! We are dedicated to connecting renters with their ideal homes and helping landlords find reliable tenants. Our mission is to simplify the rental process, making it efficient, transparent, and hassle-free.
              </p>
              <h2 className="card-subtitle mt-4 mb-3">Our Mission</h2>
              <p className="card-text">
                We strive to provide an exceptional experience for both renters and landlords by leveraging technology and innovative solutions. Our platform offers comprehensive tools and resources to streamline every aspect of property renting and management.
              </p>
              <h2 className="card-subtitle mt-4 mb-3">Our Values</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Integrity: We maintain the highest ethical standards in all our interactions.</li>
                <li className="list-group-item">Transparency: We believe in open communication and clear, honest dealings.</li>
                <li className="list-group-item">Innovation: We continuously seek to improve and innovate our services to better serve our users.</li>
                <li className="list-group-item">Customer Satisfaction: Our users are at the heart of everything we do, and we are committed to exceeding their expectations.</li>
              </ul>
              <h2 className="card-subtitle mt-4 mb-3">Meet Our Team</h2>
              <p className="card-text">
                Our team is comprised of experienced professionals passionate about real estate and technology. We work tirelessly to ensure that our platform remains the best choice for your rental needs.
              </p>
              <div className="text-center mt-4">
                <a href="/contact-us" className="btn btn-primary custom-btn">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
