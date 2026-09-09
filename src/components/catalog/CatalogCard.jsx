import { labels } from '../../data/catalogLabels';

const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(Math.round(Number(value) || 0));

export default function CatalogCard({ bike, onOpen }) {
  const status = labels[bike.status] || bike.status;
  const image = typeof bike.images?.[0] === 'string' ? bike.images[0] : bike.images?.[0]?.url;

  return (
    <article className="inventory-card">
      <button className="inventory-card-link" type="button" onClick={() => onOpen(bike.id)} aria-label={`Открыть ${bike.brand} ${bike.model}`}>
        <div className="inventory-image">
          <img src={image} alt={`${bike.brand} ${bike.model}, ${bike.year}`} loading="lazy" />
          <span className="inventory-status">{status}</span>
        </div>
        <div className="inventory-body">
          <div className="inventory-heading">
            <div>
              <span className="inventory-brand">{bike.brand}</span>
              <h2>{bike.model}</h2>
            </div>
            <span className="inventory-year">{bike.year}</span>
          </div>
          <strong className="inventory-price">{bike.currency === 'USD' ? '$ ' : '¥ '}{formatNumber(bike.estimatedKyrgyzstanPrice)}</strong>
          <div className="inventory-meta">
            <span>{bike.engineCc} см³</span>
            <span>{formatNumber(bike.mileage)} км</span>
            <span>{bike.auctionLocation || 'Japan'}</span>
          </div>
          <div className="inventory-footer"><span>{bike.type}</span><span>Открыть детали <b aria-hidden="true">→</b></span></div>
        </div>
      </button>
    </article>
  );
}
