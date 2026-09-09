import { useEffect, useRef } from 'react';

export default function CatalogFilters({ filters, options, onChange, onReset, onApply, onClose, open }) {
  const firstControl = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('catalog-filters-open');
    firstControl.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('catalog-filters-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className={`catalog-filters ${open ? 'is-open' : ''}`} aria-label="Фильтры каталога">
      <div className="catalog-filters-head"><div><span className="filter-kicker">INVENTORY FILTERS</span><h2>Найти мотоцикл</h2></div><button className="filter-close" type="button" onClick={onClose} aria-label="Закрыть фильтры">×</button></div>
      <div className="catalog-filter-fields">
        <label>Марка<select ref={firstControl} value={filters.brand} onChange={(event) => set('brand', event.target.value)}><option value="">Все марки</option>{options.brands.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Модель<select value={filters.model} onChange={(event) => set('model', event.target.value)}><option value="">Все модели</option>{options.models.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Год от<select value={filters.yearFrom} onChange={(event) => set('yearFrom', event.target.value)}><option value="">Любой год</option>{options.years.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Объём от<select value={filters.engineFrom} onChange={(event) => set('engineFrom', event.target.value)}><option value="">Любой объём</option>{options.engines.map((value) => <option key={value}>{value} см³</option>)}</select></label>
        <label>Пробег до<select value={filters.mileageTo} onChange={(event) => set('mileageTo', event.target.value)}><option value="">Любой пробег</option>{options.mileages.map((value) => <option key={value}>{value.toLocaleString('ru-RU')} км</option>)}</select></label>
        <label>Цена до<select value={filters.priceTo} onChange={(event) => set('priceTo', event.target.value)}><option value="">Любая цена</option>{options.prices.map((value) => <option key={value}>{value.toLocaleString('ru-RU')} USD</option>)}</select></label>
        <label>Аукцион<select value={filters.auction} onChange={(event) => set('auction', event.target.value)}><option value="">Все площадки</option>{options.auctions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Статус<select value={filters.status} onChange={(event) => set('status', event.target.value)}><option value="">Все статусы</option>{options.statuses.map((value) => <option key={value.value} value={value.value}>{value.label}</option>)}</select></label>
      </div>
      <div className="catalog-filter-actions"><button type="button" className="filter-reset" onClick={onReset}>Сбросить всё</button><button type="button" className="button" onClick={onApply}>Показать мотоциклы</button></div>
    </aside>
  );
}
