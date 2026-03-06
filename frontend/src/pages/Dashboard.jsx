import { Link } from 'react-router-dom';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import isTokenValid from '../services/tokenvalidity';
import { useEffect } from 'react';
export default function Dashboard() {


  const navigate = useNavigate();

useEffect(()=>{
if(!isTokenValid()){
  navigate('/');
}
},[]);

  function handlelogout(){
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <main className="dashboard-page" role="main">
      <header className="dashboard-page__header">
        <h1 className="dashboard-page__title">Dashboard</h1>
        <nav className="dashboard-page__nav">
          
          <button onClick={handlelogout}>Sign out</button>
        </nav>
      </header>
      <section className="dashboard-page__section">
        <h2 id="dashboard-heading">Your dashboard</h2>
        <p>Manage your auctions and bids here.</p>
      </section>
    </main>
  );
}

