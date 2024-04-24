// Navbar.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../navbar.module.css';
import { AuthContext } from '../authentication/AuthContext';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  console.log('Is Authenticated:', isAuthenticated); // Check if isAuthenticated is correctly set

  return (
    <header className="App-header">
      <nav className={`${styles.navbar}`}>
        <a href="#home" className={`${styles.logo}`}>
          <img src="/rgreement.png" alt="Company Logo" />
        </a>
        <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
          <li onClick={removeActive}>
            <Link to="/home" className={`${styles.navLink}`}>Home</Link>
          </li>

          {isAuthenticated ? (
            <>
          <li onClick={removeActive}>
          <Link to="/contract" className={`${styles.navLink}`}>Template</Link>
        </li>
        <li onClick={removeActive}>
          <Link to="/update_contract" className={`${styles.navLink}`}>Update Contract</Link>
        </li>
        <li onClick={removeActive}>
          <Link to="/list" className={`${styles.navLink}`}>Find Contract</Link>
        </li>
        </>

          ) : (
            <li onClick={removeActive}>
            <Link to="/about" className={`${styles.navLink}`}>About</Link>
          </li>
          )
        }

          {isAuthenticated ? (
            <li onClick={removeActive}>
              <button className={`${styles.navLink}`} onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li onClick={removeActive}>
              <Link to="/login" className={`${styles.navLink}`}>Login</Link>
            </li>
          )}
        </ul>
        <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
