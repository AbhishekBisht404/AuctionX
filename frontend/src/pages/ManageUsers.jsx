import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './ManageUsers.css';

const ManageUsers = () => {
  return (
    <div className="manage-users-layout">
      <Sidebar />
      <main className="manage-users-main">
        <Topbar />
        <div className="manage-users-canvas">
          <h2>Manage Users</h2>
          <p>View and manage user accounts and roles.</p>
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;
