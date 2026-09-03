// Replace MockAuctionProvider with a server-backed implementation when auction credentials are available.
export class MockAuctionProvider {
  constructor(read) { this.read = read; }
  async getMotorcycles(filters = {}) {
    const bikes = this.read();
    return bikes.filter((bike) => !filters.brand || bike.brand === filters.brand);
  }
  async getMotorcycle(id) { return this.read().find((bike) => bike.id === id) || null; }
}

export const auctionProviderContract = {
  getMotorcycles: 'getMotorcycles(filters)',
  getMotorcycle: 'getMotorcycle(id)',
};
