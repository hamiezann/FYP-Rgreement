import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './dropdown.css'; // Optional: for any custom styles

const DropdownMenu = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleLogoutClick = () => {
    handleLogout();
    setIsOpen(false); // Close dropdown after logout
  };

  return (
    <Dropdown show={isOpen} onToggle={handleOpen} align="end"> {/* align="end" to right-align the menu */}
      <Dropdown.Toggle variant="transparent" id="dropdown-basic">
        <i className="fas fa-ellipsis-v d-none d-md-inline"></i> {/* Font Awesome icon, hidden on small screens */}
        <i className="fas fa-bars d-md-none"></i> {/* Font Awesome icon for menu, visible on small screens */}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-right"> {/* Right-aligned dropdown */}
        <Dropdown.Item as={Link} to="/conversations" onClick={() => setIsOpen(false)}>All Conversations</Dropdown.Item>
        <Dropdown.Item as={Link} to="/my-property" onClick={() => setIsOpen(false)}>My Property</Dropdown.Item>
        <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
