import React from 'react';
import '../style/template.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <div>
        <h1 className='title'>Welcome Landlord,</h1>
      </div>
      <div className="row">
        <div className='template-column' >
          <div className='template-box-container'>
            <h2>Generate Contract</h2>
            <p>Choose from our list of rental contract template for different property.</p>
            <Link to="/landlord_form"  className='for-container'>
            Generate
           </Link>
          </div>
        </div>
        <div className='template-column'>
          <div className='template-box-container'>
            <h2>My Tenant</h2>
            <p>See the list of your tenant.</p>
            <Link to="#" className='for-container'>Proceed</Link>
          </div>
        </div>
        <div className='template-column'>
          <div className='template-box-container'>
            <h2>My Property</h2>
            <p>See the list of your house.</p>
            <Link to="/yourhouse-list" className='for-container'>View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
