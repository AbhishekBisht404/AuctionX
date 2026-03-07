import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AuctionDetail from './pages/AuctionDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import BrowseMarket from './pages/BrowseMarket.jsx';
import AuctionsManager from './pages/AuctionsManager.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import CreateAuction from './pages/CreateAuction.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction/:id" element={<AuctionDetail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route path="/dashboard/browseMarket" element={<BrowseMarket />} />
        <Route path="/dashboard/manageUsers" element={<ManageUsers />} />
        <Route path="/dashboard/auctionManager" element={<AuctionsManager />} />
        <Route path="/create-auction" element={<CreateAuction />} />
    </Routes>
  )
}

export default App;