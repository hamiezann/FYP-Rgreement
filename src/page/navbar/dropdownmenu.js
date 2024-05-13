// import React, { useState } from 'react';
// import { Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { styled } from '@mui/material/styles';
// import { Link } from 'react-router-dom';

// const StyledIconButton = styled(IconButton)(({ theme }) => ({
//   color: theme.palette.common.white,
// }));

// const DropdownMenu = ({ handleLogout }) => {
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogoutClick = () => {
//     handleLogout();
//     handleClose();
//   };

//   return (
//     <div>
//       <Tooltip title="More Options">
//         <StyledIconButton onClick={handleClick}>
//           <MoreVertIcon />
//         </StyledIconButton>
//       </Tooltip>
//       <Menu
//         id="dropdown-menu"
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//       >
//         <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
//         {/* Add more MenuItem components for additional options */}
//         <MenuItem component={Link} to="/conversations" onClick={handleClose}>All Conversations</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default DropdownMenu;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

const DropdownMenu = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleLogoutClick = () => {
    handleLogout();
    setIsOpen(false); // Close dropdown after logout
  };

  return (
    <Dropdown onToggle={handleOpen}>
      <Dropdown.Toggle variant="transparent" className="d-none d-md-inline"> {/* Hide on small screens */}
        <i className="fas fa-ellipsis-v"></i> {/* Font Awesome icon */}
      </Dropdown.Toggle>
      <Dropdown.Toggle variant="transparent" className="d-md-none"> {/* Show on small screens */}
        <i className="fas fa-bars"></i> {/* Font Awesome icon for menu */}
      </Dropdown.Toggle>
      <Dropdown.Menu show={isOpen} className="dropdown-menu-right"> {/* Right-aligned dropdown */}
        <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
        <Dropdown.Item as={Link} to="/conversations" onClick={() => setIsOpen(false)}>All Conversations</Dropdown.Item>
        <Dropdown.Item as={Link} to="/my-property" onClick={() => setIsOpen(false)}>My Property</Dropdown.Item>
        {/* Add more Dropdown.Item components for additional options */}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
