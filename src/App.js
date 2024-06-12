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
import { AuthContext } from './authentication/AuthContext';
import RentHouseList from './page/landlord/landlord_house_list';
import UpdateRentHouse from './page/landlord/update_housedb';
import HouseContractDetails from './page/landlord/house_contract_details';
import UpdateHouseContractForm from './page/landlord/update_contract_details';
import RentNearby from './page/renter/rentby_list';
import HouseDetailPage from './page/renter/rental_house_detail';
import MessageMain from './page/messaging/MessageMain';
import ConversationsPage from './page/messaging/ConversationList';
import ConversationPage from './page/messaging/ConversationShow';
import FindHouse from './page/renter/find_house';
import DisplaySearchHouse from './page/renter/display_search_house';
import ApplyHouseForm from './page/renter/apply_house';
import TenantListPage from './page/landlord/tenant_list';
import RenterDashboard from './page/renter/my_property';
import RentContractPage from './page/renter/sign_now';
import AboutPage from './page/about_page';
import EventsPage from './page/landlord/event_list';
import RenterMenu from './page/renter/menu';
import RequestDepositReleasePage from './page/landlord/request_deposit_release';
import DepositReleaseRequests from './page/renter/approve_deposit_request';
import EndContract from './page/landlord/end_contract';
import ManageHouse from './page/landlord/manage_house';
import './App.css';
import FilterModal from './page/renter/FilterModal';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="App-content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/nearby-rent" element={<RentNearby />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route path="/house-details" element={<HouseDetailPage />} />
              </>
            ) : role === 'landlord' ? (
              <>
                <Route path="*" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/nearby-rent" element={<RentNearby />} />
                <Route path="/contract" element={<Contract />} />
                <Route path="/landlord_form" element={<LandlordForm />} />
                <Route path="/list" element={<CreatedView />} />
                <Route path="/yourhouse-list" element={<RentHouseList />} />
                <Route path="/update-rent-house/:houseId" element={<UpdateRentHouse />} />
                <Route path="/house-contract-details" element={<HouseContractDetails />} />
                <Route path="/rental-contract-update" element={<UpdateHouseContractForm />} />
                <Route path="/update_contract" element={<ContractUpdateForm />} />
                <Route path="/chat/:houseId" element={<MessageMain />} />
                <Route path="/conversations" element={<ConversationsPage />} />
                <Route path="/conversations/:senderId/:recipientId" element={<ConversationPage />} />
                <Route path="/yourtenant-list" element={<TenantListPage />} />
                <Route path="/house-details/:houseId" element={<HouseDetailPage />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route path="/contract-event" element={<EventsPage />} />
                <Route path="/request-deposit-release" element={<RequestDepositReleasePage />} />
                <Route path="/end-contract" element={<EndContract />} />
                <Route path="/manage-house" element={<ManageHouse />} />
                <Route path="/filter-modal" element={<FilterModal />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/nearby-rent" element={<RentNearby />} />
                <Route path="/house-details/:houseId" element={<HouseDetailPage />} />
                <Route path="/find-house/:houseId" element={<DisplaySearchHouse />} />
                <Route path="/chat/:houseId" element={<MessageMain />} />
                <Route path="/conversations" element={<ConversationsPage />} />
                <Route path="/conversations/:senderId/:recipientId" element={<ConversationPage />} />
                <Route path="/find-house" element={<FindHouse />} />
                <Route path="/apply-house/:houseId" element={<ApplyHouseForm />} />
                <Route path="/my-property" element={<RenterDashboard />} />
                <Route path="/sign-now" element={<RentContractPage />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route path="/house-contract-details" element={<HouseContractDetails />} />
                <Route path="/contract-event" element={<EventsPage />} />
                <Route path="/renter-menu" element={<RenterMenu />} />
                <Route path="/approve-deposit" element={<DepositReleaseRequests />} />
                <Route path="/filter-modal" element={<FilterModal />} />
              </>
            )}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
