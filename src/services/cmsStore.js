const EVENTS = 'motozak:cms-changed';

export const CMS_KEYS = {
  motorcycles: 'motozak-bikes',
  auctions: 'motozak-auctions',
  applications: 'motozak-applications',
  content: 'motozak-content',
  settings: 'motozak-settings',
  faq: 'motozak-faq',
};

export function readCollection(key, fallback = []) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function readObject(key, fallback = {}) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writeValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENTS, { detail: key }));
  return value;
}

export function subscribeCms(callback) {
  const handler = (event) => callback(event.detail);
  window.addEventListener(EVENTS, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENTS, handler);
    window.removeEventListener('storage', handler);
  };
}

export function publicMotorcycle(motorcycle) {
  return motorcycle.publicationStatus !== 'draft' && motorcycle.archived !== true;
}

export function normalizeMotorcycle(item) {
  return {
    ...item,
    id: String(item.id),
    year: Number(item.year) || new Date().getFullYear(),
    engineCc: Number(item.engineCc) || 0,
    mileage: Number(item.mileage ?? item.mileageKm) || 0,
    auctionPrice: Number(item.auctionPrice ?? item.price?.value) || 0,
    estimatedKyrgyzstanPrice: Number(item.estimatedKyrgyzstanPrice ?? item.auctionPrice) || 0,
    currency: item.currency || item.price?.currency || 'USD',
    images: Array.isArray(item.images) ? item.images.map((image, index) => typeof image === 'string' ? { url: image, alt: '', isPrimary: index === 0 } : image).filter((image) => image?.url) : [],
    publicationStatus: item.publicationStatus || (item.status === 'DRAFT' ? 'draft' : 'published'),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}
