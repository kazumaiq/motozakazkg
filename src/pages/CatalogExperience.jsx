import { useEffect, useMemo, useState } from 'react';
import CatalogCard from '../components/catalog/CatalogCard';
import CatalogFilters from '../components/catalog/CatalogFilters';
import { createMotorcycleRepository } from '../services/motorcycleRepository';
import { labels } from '../data/catalogLabels';

const initialFilters = { brand: '', model: '', yearFrom: '', engineFrom: '', mileageTo: '', priceTo: '', auction: '', status: '' };
const sortOptions = [['newest', 'Сначала новые'], ['priceAsc', 'Цена: ниже'], ['priceDesc', 'Цена: выше'], ['year', 'По году'], ['mileage', 'По пробегу']];

const getOptions = (bikes) => ({
  brands: [...new Set(bikes.map((bike) => bike.brand))].sort(),
  models: [...new Set(bikes.map((bike) => bike.model))].sort(),
  years: [...new Set(bikes.map((bike) => bike.year))].sort((a, b) => b - a),
  engines: [...new Set(bikes.map((bike) => bike.engineCc))].sort((a, b) => a - b),
  mileages: [...new Set(bikes.map((bike) => bike.mileage))].sort((a, b) => a - b),
  prices: [...new Set(bikes.map((bike) => bike.auctionPrice))].sort((a, b) => a - b),
  auctions: [...new Set(bikes.map((bike) => bike.auctionLocation).filter(Boolean))].sort(),
  statuses: [...new Set(bikes.map((bike) => bike.status))].map((value) => ({ value, label: labels[value] || value })),
});

export default function CatalogExperience({ Layout, Eyebrow, Button, navigate, repository }) {
  const dataSource = repository || createMotorcycleRepository(() => []);
  const [bikes, setBikes] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    dataSource.list().then(setBikes).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const options = useMemo(() => getOptions(bikes), [bikes]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = bikes.filter((bike) => {
      const haystack = [bike.brand, bike.model, bike.auctionLocation, bike.id, bike.year].join(' ').toLowerCase();
      return (!normalized || haystack.includes(normalized)) &&
        (!filters.brand || bike.brand === filters.brand) &&
        (!filters.model || bike.model === filters.model) &&
        (!filters.yearFrom || bike.year >= Number(filters.yearFrom)) &&
        (!filters.engineFrom || bike.engineCc >= Number(filters.engineFrom)) &&
        (!filters.mileageTo || bike.mileage <= Number(filters.mileageTo)) &&
        (!filters.priceTo || bike.auctionPrice <= Number(filters.priceTo)) &&
        (!filters.auction || bike.auctionLocation === filters.auction) &&
        (!filters.status || bike.status === filters.status);
    });
    return result.sort((a, b) => {
      if (sort === 'priceAsc') return a.auctionPrice - b.auctionPrice;
      if (sort === 'priceDesc') return b.auctionPrice - a.auctionPrice;
      if (sort === 'year') return b.year - a.year;
      if (sort === 'mileage') return a.mileage - b.mileage;
      return b.year - a.year;
    });
  }, [bikes, filters, query, sort]);

  const activeFilters = Object.entries(filters).filter(([, value]) => value);
  const reset = () => setFilters(initialFilters);

  return <Layout><main className="page catalog-page"><div className="catalog-intro"><div><Eyebrow>MOTO INVENTORY</Eyebrow><h1>Мотоциклы<br/><span>из Японии.</span></h1><p>Мотоциклы с японских аукционов. Проверка, расчёт и доставка в Кыргызстан.</p></div><div className="catalog-total"><strong>{bikes.length}</strong><span>позиций в базе</span></div></div><section className="catalog-shell"><div className="catalog-toolbar"><label className="catalog-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск марки или модели" aria-label="Поиск марки или модели" /></label><button className="mobile-filter-trigger" type="button" onClick={() => setFiltersOpen(true)}>Фильтры <b>{activeFilters.length || ''}</b></button><label className="catalog-sort"><span>Сортировка</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{sortOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div><div className="catalog-content"><CatalogFilters filters={filters} options={options} onChange={setFilters} onReset={reset} onApply={() => setFiltersOpen(false)} onClose={() => setFiltersOpen(false)} open={filtersOpen} /><div className="catalog-results"><div className="catalog-result-head"><div><strong>{filtered.length}</strong><span> мотоциклов найдено</span></div><div className="active-filter-chips">{activeFilters.map(([key, value]) => <button type="button" key={key} onClick={() => setFilters({ ...filters, [key]: '' })}>{key === 'status' ? labels[value] : value} ×</button>)}{activeFilters.length > 0 && <button type="button" className="clear-all" onClick={reset}>Сбросить все</button>}</div></div>{loading && <div className="inventory-grid" aria-label="Загрузка каталога">{[1, 2, 3, 4].map((item) => <div className="inventory-skeleton" key={item} />)}</div>}{error && <div className="catalog-state"><h2>Не удалось загрузить мотоциклы.</h2><button className="button" type="button" onClick={load}>Попробовать ещё раз</button></div>}{!loading && !error && filtered.length > 0 && <div className="inventory-grid">{filtered.map((bike) => <CatalogCard key={bike.id} bike={bike} onOpen={(id) => navigate(`/catalog/${id}`)} />)}</div>}{!loading && !error && filtered.length === 0 && <div className="catalog-state"><h2>Ничего не найдено</h2><p>Попробуйте изменить параметры поиска.</p><button className="button ghost" type="button" onClick={reset}>Сбросить фильтры</button></div>}</div></div></section><section className="catalog-cta"><div><Eyebrow>NEED A SPECIFIC MODEL?</Eyebrow><h2>Не нашли нужный<br/><span>мотоцикл?</span></h2></div><Button href="/contacts">Оставить заявку</Button></section></main></Layout>;
}
