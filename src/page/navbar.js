// Navbar.js
import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import  styles from '../navbar.module.css';

function Navbar() {
    // adding the states 
    const [isActive, setIsActive] = useState(false);
    //add the active class
    const toggleActiveClass = () => {
      setIsActive(!isActive);
    };
    //clean up function to remove the active class
    const removeActive = () => {
      setIsActive(false)
    }
    return (
    //   <div className="App">
        <header className="App-header">
          <nav className={`${styles.navbar}`}>
            {/* logo */}
           
            <a href='#home' className={`${styles.logo}`}>RGreement</a>
            <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
              <li onClick={removeActive}>
              <Link to="/" className={`${styles.navLink}`}>Home</Link>
              </li>
              <li onClick={removeActive}>
              <Link to="/contract" className={`${styles.navLink}`}>Template</Link>
              </li>
              {/* <li onClick={removeActive}>
              <Link to="/contract_list" className={`${styles.navLink}`}>List</Link>
              </li> */}
              {/* <li onClick={removeActive}>
              <Link to="/landlord_form" className={`${styles.navLink}`}>Landlord</Link>
              </li> */}
              <li onClick={removeActive}>
              <Link to="/list" className={`${styles.navLink}`}>Find Contract</Link>
              </li>
            </ul>
            <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
            </div>
          </nav>
        </header>
    //   </div>
    );
  }
  export default Navbar;
  ;
