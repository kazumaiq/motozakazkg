const normalize = (bike) => ({
  id: bike.id,
  motorcycle: bike,
  lotNumber: bike.lotNumber || null,
  auctionHouse: bike.auctionHouse || bike.auction || null,
  location: bike.auctionLocation || null,
  auctionDate: bike.auctionDate || null,
  grade: bike.grade || null,
  auctionPrice: bike.auctionPrice,
  status: bike.status,
});

export class MockAuctionProvider {
  constructor(read) { this.read = read; }
  async getLots({ query = '', filters = {}, sort = 'newest', page = 1, limit = 9 } = {}) {
    const normalizedQuery = query.trim().toLowerCase();
    const all = this.read().map(normalize).filter((lot) => {
      const bike = lot.motorcycle;
      const searchable = [bike.brand, bike.model, lot.id, lot.lotNumber, lot.auctionHouse, lot.location, bike.year].filter(Boolean).join(' ').toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (!filters.brand || bike.brand === filters.brand) && (!filters.model || bike.model === filters.model) && (!filters.auction || lot.location === filters.auction || lot.auctionHouse === filters.auction) && (!filters.year || String(bike.year) === String(filters.year)) && (!filters.status || bike.status === filters.status) && (!filters.price || bike.auctionPrice <= Number(filters.price)) && (!filters.engine || bike.engineCc >= Number(filters.engine)) && (!filters.mileage || bike.mileage <= Number(filters.mileage));
    });
    const sorted = [...all].sort((a, b) => {
      if (sort === 'priceAsc') return a.auctionPrice - b.auctionPrice;
      if (sort === 'priceDesc') return b.auctionPrice - a.auctionPrice;
      if (sort === 'year') return b.motorcycle.year - a.motorcycle.year;
      if (sort === 'mileage') return a.motorcycle.mileage - b.motorcycle.mileage;
      return b.motorcycle.year - a.motorcycle.year;
    });
    const start = (page - 1) * limit;
    return { items: sorted.slice(start, start + limit), total: sorted.length, page, limit };
  }
  async getLot(id) { const bike = this.read().find((item) => item.id === id); return bike ? normalize(bike) : null; }
  async getFilters() {
    const lots = this.read().map(normalize);
    return { brands: [...new Set(lots.map((lot) => lot.motorcycle.brand))].sort(), models: [...new Set(lots.map((lot) => lot.motorcycle.model))].sort(), auctions: [...new Set(lots.map((lot) => lot.location).filter(Boolean))].sort(), years: [...new Set(lots.map((lot) => lot.motorcycle.year))].sort((a, b) => b - a), statuses: [...new Set(lots.map((lot) => lot.status))], engines: [...new Set(lots.map((lot) => lot.motorcycle.engineCc))].sort((a, b) => a - b), mileages: [...new Set(lots.map((lot) => lot.motorcycle.mileage))].sort((a, b) => a - b), prices: [...new Set(lots.map((lot) => lot.auctionPrice))].sort((a, b) => a - b) };
  }
}
