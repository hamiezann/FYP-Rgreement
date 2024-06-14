import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/renter/menu.css";
import useDocumentTitle from '../../utils/useDocumentTitles';

const RenterMenu = () => {
  useDocumentTitle('Menu - Rgreement');
  return (
    <div>
      <div className='renter-top-header'>
        <h1 className='title'>Welcome Tenant,</h1>
      </div>
      <div className="container mt-4 card-container">
        <div className="row">
          <div className='col-md-4 mb-4'>
            <div className='card template-box-container h-100'>
              <div className="card-body d-flex flex-column">
                <h2 className="card-title">My Profile</h2>
                <p className="card-text">Build up my portfolio and update profile.</p>
                <Link to="/my-profile" className='btn btn-primary mt-auto'>
                  Go To Profile
                </Link>
              </div>
            </div>
          </div>
          <div className='col-md-4 mb-4'>
            <div className='card template-box-container h-100'>
              <div className="card-body d-flex flex-column">
                <h2 className="card-title">My Tenant</h2>
                <p className="card-text">See the list of your tenants.</p>
                <Link to="/yourtenant-list" className='btn btn-primary mt-auto'>
                  Proceed
                </Link>
              </div>
            </div>
          </div>
          <div className='col-md-4 mb-4'>
            <div className='card template-box-container h-100'>
              <div className="card-body d-flex flex-column">
                <h2 className="card-title">My Property</h2>
                <p className="card-text">See the list of your houses.</p>
                <Link to="/my-property" className='btn btn-primary mt-auto'>
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RenterMenu;
