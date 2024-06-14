import React from 'react';
import '../style/template.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import useDocumentTitle from '../utils/useDocumentTitles';

function App() {
  useDocumentTitle('Menu - Rgreement');
  return (
    <div>
      <div className='renter-top-header'>
        <h1 className='title'>Welcome Landlord,</h1>
      </div>
      <div className="container mt-4 card-container">
        <div className="row justify-content-center">
          <div className='col-md-6 mb-4'>
            <div className='card template-box-container h-100'>
              <div className="card-body d-flex flex-column">
                <h2 className="card-title">Generate Contract</h2>
                <p className="card-text">Choose from our list of rental contract templates for different properties.</p>
                <Link to="/landlord_form" className='btn btn-primary mt-auto'>
                  Generate
                </Link>
              </div>
            </div>
          </div>
          <div className='col-md-6 mb-4'>
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
          <div className='col-md-6 mb-4'>
            <div className='card template-box-container h-100'>
              <div className="card-body d-flex flex-column">
                <h2 className="card-title">My Property</h2>
                <p className="card-text">See the list of your houses.</p>
                <Link to="/yourhouse-list" className='btn btn-primary mt-auto'>
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

export default App;
