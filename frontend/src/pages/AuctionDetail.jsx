import { useParams, Link } from 'react-router-dom';
import './AuctionDetail.css';

export default function AuctionDetail() {
  const { id } = useParams();

  return (
    <main className="auction-detail-page" role="main">
      <header className="auction-detail-page__header">
        <h1 className="auction-detail-page__title">Auction</h1>
        <nav className="auction-detail-page__nav">
          <Link to="/">Home</Link>
          <span> / Auction {id}</span>
        </nav>
      </header>
      <article className="auction-detail-page__article">
        <h2 id="auction-heading">Auction #{id}</h2>
        <p>Auction details will be shown here.</p>
      </article>
    </main>
  );
}
