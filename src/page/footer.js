import React from "react";
import '../style/footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer-gradient text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>Address: No 1, Jln Dihatiku 9, Malaysia</li>
              <li>Email: info@xann.com</li>
              <li>Phone: +123 call2 tak dapat</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>Follow Us</h5>
            <ul className="list-unstyled social-icons">
              <li>
                <a href="#!" className="text-light">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
              </li>
              <li>
                <a href="#!" className="text-light">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
              </li>
              <li>
                <a href="#!" className="text-light">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <p className="text-center">&copy; {new Date().getFullYear()} RGreement by Xann . All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
