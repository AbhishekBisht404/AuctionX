import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './BrowseMarket.css';

const BrowseMarket = () => {
  return (
    <div className="browse-market-layout">
     <Sidebar/>
     <main className="browse-market-main">
      <Topbar />
      <div className="browse-market-canvas">
        <h2>Browse Market</h2>
        <p>Explore ongoing auctions and place your bids!</p>
      </div>
     </main>
    </div>
  )
}

export default BrowseMarket;
