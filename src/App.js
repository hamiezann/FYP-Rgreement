// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './page/navbar';
import Footer from './page/footer';
import Home from './page/home';
import Contract from './page/template';
import List from './page/contract_list';
import LandlordForm from './page/landlordForm';
import CreatedView from './page/created_view';
//import styles from "./style/contract.module.css";
function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-header">
        <Navbar />
       
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/contract_list" element={<List />} />
          <Route path="/landlord_form" element={<LandlordForm />} />
          <Route path="/list" element={<CreatedView />} />
        </Routes>
    
        {/* <Footer/> */}

        </div>
        </div>
    </Router>
  );
}

export default App;
