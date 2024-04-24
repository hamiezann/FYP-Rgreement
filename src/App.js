import React, { createContext, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './page/navbar';
import Footer from './page/footer';
import Home from './page/home';
import Contract from './page/template';
import LandlordForm from './page/landlordForm';
import CreatedView from './page/created_view';
import ContractUpdateForm from './page/update_contract';
import RegistrationForm from './authentication/register';
import LoginForm from './authentication/login';
import {AuthProvider, AuthContext} from './authentication/AuthContext';



 //const AuthContext = createContext(null);
  // function App() {
    const App = () => {
      // const [isAuthenticated, setIsAuthenticated] = useState(false);
       const {isAuthenticated} = useContext(AuthContext);
    
      // useEffect(() => {
      //   const token = localStorage.getItem('access_token');
      //   setIsAuthenticated(!!token);
      // }, []);
    
      return (
        //<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>

            <Router>
            <div className="App">
              <div className="App-header">
                <Navbar />
                <Routes>
                  {!isAuthenticated ? (
                    <>
                      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
                      <Route path='/' element={<Home /> } />
                      <Route path="/register" element={<RegistrationForm />} />
                      <Route path="/login" element={<LoginForm />} />
                      <Route path="/home" element={<Home />} />
                    </>
                  ) : (
                    <>
                      <Route path="*" element={<Navigate to="/home" />} />
                      {/* Other authenticated routes */}
                      <Route path="/home" element={<Home />} />
                      <Route path="/contract" element={<Contract />} />
                      <Route path="/landlord_form" element={<LandlordForm />} />
                      <Route path="/list" element={<CreatedView />} />
                      <Route path="/update_contract" element={<ContractUpdateForm />} />
                    </>
                  )}
                </Routes>
              </div>
            </div>
          </Router>
   
      
      );
    }
    

export default App;
