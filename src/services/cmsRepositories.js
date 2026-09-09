import { CMS_KEYS, normalizeMotorcycle, publicMotorcycle, readCollection, readObject, writeValue } from './cmsStore';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function createCmsRepositories({ seedMotorcycles = [], seedAuctions = [] } = {}) {
  const motorcycles = () => readCollection(CMS_KEYS.motorcycles, seedMotorcycles).map(normalizeMotorcycle);
  const auctions = () => readCollection(CMS_KEYS.auctions, seedAuctions);
  const applications = () => readCollection(CMS_KEYS.applications, []);

  return {
    motorcycles: {
      async list({ publicOnly = false } = {}) {
        const items = motorcycles();
        return publicOnly ? items.filter(publicMotorcycle) : items;
      },
      async getById(itemId) {
        return motorcycles().find((item) => item.id === String(itemId)) || null;
      },
      async save(item) {
        const next = normalizeMotorcycle({ ...item, updatedAt: new Date().toISOString() });
        const current = motorcycles();
        const exists = current.some((entry) => entry.id === next.id);
        writeValue(CMS_KEYS.motorcycles, exists ? current.map((entry) => entry.id === next.id ? next : entry) : [...current, next]);
        return next;
      },
      async remove(itemId) {
        writeValue(CMS_KEYS.motorcycles, motorcycles().filter((item) => item.id !== String(itemId)));
      },
    },
    auctions: {
      async list() { return auctions(); },
      async getById(itemId) { return auctions().find((item) => item.id === String(itemId)) || null; },
      async save(item) {
        const next = { ...item, id: String(item.id || id()), updatedAt: new Date().toISOString(), images: Array.isArray(item.images) ? item.images : [] };
        const current = auctions();
        writeValue(CMS_KEYS.auctions, current.some((entry) => entry.id === next.id) ? current.map((entry) => entry.id === next.id ? next : entry) : [...current, next]);
        return next;
      },
      async remove(itemId) { writeValue(CMS_KEYS.auctions, auctions().filter((item) => item.id !== String(itemId))); },
    },
    applications: {
      async list() { return applications(); },
      async save(item) {
        const next = { ...item, id: String(item.id || id()), updatedAt: new Date().toISOString() };
        const current = applications();
        writeValue(CMS_KEYS.applications, current.some((entry) => entry.id === next.id) ? current.map((entry) => entry.id === next.id ? next : entry) : [next, ...current]);
        return next;
      },
    },
    settings: {
      async get() { return readObject(CMS_KEYS.settings, {}); },
      async save(value) { return writeValue(CMS_KEYS.settings, value); },
    },
    content: {
      async get() { return readObject(CMS_KEYS.content, {}); },
      async save(value) { return writeValue(CMS_KEYS.content, value); },
    },
    faq: {
      async list() { return readCollection(CMS_KEYS.faq, []); },
      async save(items) { return writeValue(CMS_KEYS.faq, items); },
    },
  };
}
