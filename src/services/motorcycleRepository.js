import { normalizeMotorcycle, publicMotorcycle } from './cmsStore';

export function createMotorcycleRepository(read, write = () => {}) {
  return {
    async list() {
      return read().map(normalizeMotorcycle).filter(publicMotorcycle);
    },
    async getById(id) {
      return read().map(normalizeMotorcycle).find((motorcycle) => motorcycle.id === id && publicMotorcycle(motorcycle)) || null;
    },
    async listAll() { return read().map(normalizeMotorcycle); },
    async save(motorcycle) { return write(motorcycle); },
  };
}
