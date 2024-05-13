import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>Address: 123 Street Name, City, Country</li>
              <li>Email: info@example.com</li>
              <li>Phone: +123 456 7890</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#!">Facebook</a>
              </li>
              <li>
                <a href="#!">Twitter</a>
              </li>
              <li>
                <a href="#!">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <p className="text-center">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
