export function createMotorcycleRepository(read) {
  return {
    async list() {
      return read();
    },
    async getById(id) {
      return read().find((motorcycle) => motorcycle.id === id) || null;
    },
  };
}
