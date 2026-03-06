import { Link } from 'react-router-dom';
import './Home.css';
import isTokenValid from '../services/tokenvalidity';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  useEffect(()=>{

    if(isTokenValid()){
      navigate('/dashboard');
    }
  },[]);

  return (
  
    <main className="home-page" role="main">
      <header className="home-page__header">
        <h1 className="home-page__title">AuctionX</h1>
        <nav className="home-page__nav">
          <Link className="home-page__navlink" to="/login">Sign in</Link>
          
          <Link className="home-page__navlink" to="/register">Sign up</Link>
        </nav>
      </header>
      <section className="home-page__section">
        <h2 id="home-heading">Welcome</h2>
        <p>Browse auctions or sign in to continue.</p>
      </section>
    </main>
  );
}
