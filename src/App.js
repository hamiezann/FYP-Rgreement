import React, { useContext } from 'react';
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
import { AuthContext} from './authentication/AuthContext';
import RentHouseList from './page/landlord/landlord_house_list';
import UpdateRentHouse from './page/landlord/update_housedb';
import HouseContractDetails from './page/landlord/house_contract_details';
import UpdateHouseContractForm from './page/landlord/update_contract_details';
import RentNearby from './page/renter/rentby_list';
import HouseDetailPage from './page/renter/rental_house_detail';
import MessageMain from './page/messaging/MessageMain';

const App = () => {
   const { isAuthenticated } = useContext(AuthContext);
   const role = localStorage.getItem('role');

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Navbar />
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/nearby-rent" element={<RentNearby />} />
                <Route path="house-details" element={<HouseDetailPage />} />
              </>
            ) : role === 'landlord' ? (
              <>
                <Route path="*" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/contract" element={<Contract />} />
                <Route path="/landlord_form" element={<LandlordForm />} />
                <Route path="/list" element={<CreatedView />} />
                <Route path="/yourhouse-list" element={<RentHouseList />} />
                <Route path="/update-rent-house/:houseId" element={<UpdateRentHouse  />} />
                <Route path="/house-contract-details" element={<HouseContractDetails />} />
                <Route path="/rental-contract-update" element={<UpdateHouseContractForm />} />
                <Route path="/update_contract" element={<ContractUpdateForm />} />
                <Route path="/chat/:houseId" element={<MessageMain />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/nearby-rent" element={<RentNearby />} />
                <Route path="/house-details/:houseId" element={<HouseDetailPage />} />
                <Route path="/chat/:houseId" element={<MessageMain />} />
                {/* Add UI components specific to renters here */}
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
