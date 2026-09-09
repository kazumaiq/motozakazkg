export function createAuctionRepository(provider) {
  return {
    getLots: (params) => provider.getLots(params),
    getLot: (id) => provider.getLot(id),
    getFilters: () => provider.getFilters(),
  };
}
