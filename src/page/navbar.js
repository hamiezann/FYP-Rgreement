// // Navbar.js
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from '../navbar.module.css';
// import { AuthContext } from '../authentication/AuthContext';
// import DropdownMenu from './navbar/dropdownmenu';

// function Navbar() {
//   const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
//   const [isActive, setIsActive] = useState(false);
//   const navigate = useNavigate();
//   const role = localStorage.getItem('role');

//   const toggleActiveClass = () => {
//     setIsActive(!isActive);
//   };

//   const removeActive = () => {
//     setIsActive(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   const [menuOpen,setMenuOpen] = useState(false);
//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const handleItemClick = () => {
//     toggleMenu();
//   }


//  // console.log('Is Authenticated:', isAuthenticated); // Check if isAuthenticated is correctly set
//   console.log('User role:',role );

//   return (
//     <header className="App-header">
//       <nav className={`${styles.navbar}`}>
//         <a href="#home" className={`${styles.logo}`}>
//           <img src="/rgreement.png" alt="Company Logo" />
//         </a>
//         <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
//           <li onClick={removeActive}>
//             <Link to="/home" className={`${styles.navLink}`}>Home</Link>
//           </li>
//           <li onClick={removeActive}>
//             <Link to="/nearby-rent" className={`${styles.navLink}`}>RentBy</Link>
//           </li>

//           {isAuthenticated && role == 'landlord' && (
//             <>
//           <li onClick={removeActive}>
//           <Link to="/contract" className={`${styles.navLink}`}>Menu</Link>
//         </li>
//         {/* <li onClick={removeActive}>
//           <Link to="/update_contract" className={`${styles.navLink}`}>Update Contract</Link>
//         </li>
//         <li onClick={removeActive}>
//           <Link to="/list" className={`${styles.navLink}`}>Find Contract</Link>
//         </li> */}
//         </>
//           )}
//           {isAuthenticated && role === 'renter' && (
//             <>
//           <li onClick={removeActive}>
//                 <Link to="/find-house" className={`${styles.navLink}`}>Find Houses</Link>
//           </li>
//             </>
//           )}
        
//         {!isAuthenticated && (
//             <li onClick={removeActive}>
//             <Link to="/about" className={`${styles.navLink}`}>About</Link>
//           </li>
//           )
//         }

//           {isAuthenticated ? (
//             <li onClick={removeActive}>
//                 <DropdownMenu handleLogout={handleLogout} />
//               {/* <button className={`${styles.navLink}`} onClick={handleLogout}>Logout</button> */}
//             </li>
//           ) : (
//             <li onClick={removeActive}>
//               <Link to="/login" className={`${styles.navLink}`}>Login</Link>
//             </li>
//           )}
//         </ul>
//         <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
//           <span className={`${styles.bar}`}></span>
//           <span className={`${styles.bar}`}></span>
//           <span className={`${styles.bar}`}></span>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Navbar;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authentication/AuthContext';
import DropdownMenu from './navbar/dropdownmenu'; // Assuming this component remains unchanged

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const toggleActiveClass = () => setIsActive(!isActive);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleItemClick = () => {
    toggleActiveClass(); // Assuming this controls toggling some item within the navbar
  };

  console.log('Is Authenticated:', isAuthenticated); // Check if isAuthenticated is correctly set
  console.log('User role:', role);

  return (
    <header className="App-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light container-fluid" style={{ backgroundColor: "grey" }}> {/* Added container-fluid class */}
        <a href="#home" className="navbar-brand">
          <img src="/rgreement.png" alt="Company Logo"  style={{ width: '140px', height: '70px'}} />
        </a>
        <button
          className={`navbar-toggler ${isActive ? 'collapsed' : ''}`}
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end"> {/* Added justify-content-end class */}
            <li className="nav-item">
              <Link to="/home" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/nearby-rent" className="nav-link">
                RentBy
              </Link>
            </li>

            {isAuthenticated && role === 'landlord' && (
              <>
                <li className="nav-item">
                  <Link to="/contract" className="nav-link">
                    Menu
                  </Link>
                </li>
                {/* Add other landlord links here */}
              </>
            )}

            {isAuthenticated && role === 'renter' && (
              <li className="nav-item">
                <Link to="/find-house" className="nav-link">
                  Find Houses
                </Link>
              </li>
            )}

            {!isAuthenticated && (
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  About
                </Link>
              </li>
            )}

            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <DropdownMenu handleLogout={handleLogout} /> {/* Assuming the component uses Bootstrap's Dropdown */}
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
