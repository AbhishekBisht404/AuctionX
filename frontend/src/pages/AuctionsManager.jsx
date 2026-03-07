import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AuctionsManager.css';

const AuctionsManager = () => {
  return (
    <div className="auctions-manager-layout">
      <Sidebar />
      <main className="auctions-manager-main">
        <Topbar />
        <div className="auctions-manager-canvas">
          <h2>Manage Auctions</h2>
          <p>View, edit, and manage all platform auctions.</p>
        </div>
      </main>
    </div>
  );
};

export default AuctionsManager;
