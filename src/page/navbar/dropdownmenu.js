import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const DropdownMenu = ({ handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleClose();
  };

  return (
    <div>
      <Tooltip title="More Options">
        <StyledIconButton onClick={handleClick}>
          <MoreVertIcon />
        </StyledIconButton>
      </Tooltip>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        {/* Add more MenuItem components for additional options */}
        <MenuItem component={Link} to="/conversations" onClick={handleClose}>All Conversations</MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
