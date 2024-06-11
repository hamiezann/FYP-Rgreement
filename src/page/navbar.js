import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authentication/AuthContext';
import DropdownMenu from './navbar/dropdownmenu';
import '../navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useMediaQuery } from 'react-responsive';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [showOverlay, setShowOverlay] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  const toggleActiveClass = () => {
    setIsActive(!isActive);
    setShowOverlay(!showOverlay);
    console.log("Navbar toggled:", !isActive);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSmall(true);
    } else {
      setIsSmall(false);
    }
  };

  const closeNavbar = () => {
    if (isMobile && isActive) {
      setIsActive(false);
      console.log("Navbar closed on click/scroll");
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', closeNavbar);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', closeNavbar);
    };
  }, [isActive, isMobile]);

  return (
    // <header className="App-header">
      <header className={`App-header ${isActive && isMobile ? 'mobile-active' : ''}`}>
      <nav className={`navbar navbar-expand-lg container-fluid navbar-custom ${isSmall ? 'navbar-small' : ''}`}>
        <Link to="/home" className="navbar-brand navbar-brand-custom">
          <img src="/newlogo2.png" alt="Rgreement Logo" />
        </Link>
        <button
          className={`navbar-toggler ${isActive ? '' : 'collapsed'} navbar-toggler-custom`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={isActive}
          aria-label="Toggle navigation"
          onClick={toggleActiveClass}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isActive ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 navbar-nav-custom">
            <li className="nav-item">
              <Link to="/home" className="nav-link nav-link-custom">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/nearby-rent" className="nav-link nav-link-custom">
                RentBy
              </Link>
            </li>
            {isAuthenticated && role === 'landlord' && (
              <li className="nav-item">
                <Link to="/contract" className="nav-link nav-link-custom">
                  Menu
                </Link>
              </li>
            )}
            {isAuthenticated && role === 'renter' && (
              <>
                <li className="nav-item">
                  <Link to="/find-house" className="nav-link nav-link-custom">
                    Find Houses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/renter-menu" className="nav-link nav-link-custom">
                    Menu
                  </Link>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link to="/about-us" className="nav-link nav-link-custom">
                  About
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              isMobile ? (
                <>
                  <li className="nav-item">
                    <Link to="/conversations" className="nav-link nav-link-custom">All Conversations</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-property" className="nav-link nav-link-custom">My Property</Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link nav-link-custom btn btn-link">Logout</button>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <DropdownMenu handleLogout={handleLogout} />
                </li>
              )
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link nav-link-custom profile-link">
                  <i className="fas fa-user-circle profile-icon"></i>
                  <span className="profile-text">Login</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/contact" className="nav-link nav-link-custom contact-button">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
