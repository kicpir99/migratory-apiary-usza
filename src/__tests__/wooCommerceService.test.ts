import { describe, it, expect } from 'vitest';
import {
  normalizeImageUrl,
  mapWooProductToHoneyProduct,
  type WooProductRaw,
} from '../services/wooCommerceService';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/assets';

describe('services/wooCommerceService', () => {
  it('normalizes http and non-www sklep.pasiekausza.pl image URLs', () => {
    expect(normalizeImageUrl('http://sklep.pasiekausza.pl/wp-content/uploads/a.jpg')).toBe(
      'https://www.sklep.pasiekausza.pl/wp-content/uploads/a.jpg'
    );
    expect(normalizeImageUrl('https://sklep.pasiekausza.pl/wp-content/uploads/b.jpg')).toBe(
      'https://www.sklep.pasiekausza.pl/wp-content/uploads/b.jpg'
    );
    expect(normalizeImageUrl(undefined)).toBe(DEFAULT_PRODUCT_IMAGE);
  });

  it('maps raw WooCommerce product with normalized images and size options', () => {
    const raw: WooProductRaw = {
      id: 74,
      name: 'Propolis – Kit Pszczeli',
      slug: 'propolis-kit',
      permalink: 'https://sklep.pasiekausza.pl/produkt/propolis-kit/',
      type: 'simple',
      status: 'publish',
      description: '<p>Naturalny kit pszczeli.</p>',
      short_description: '<p>Naturalny antybiotyk.</p>',
      price: '25',
      regular_price: '25',
      sale_price: '',
      average_rating: '4.9',
      rating_count: 130,
      categories: [{ id: 27, name: 'Skarby Ula', slug: 'z-dodatkami' }],
      images: [
        {
          id: 73,
          src: 'https://sklep.pasiekausza.pl/wp-content/uploads/2026/10/oferta-propolis.jpg',
          name: 'oferta-propolis.jpg',
          alt: '',
        },
      ],
      attributes: [],
      meta_data: [
        { id: 1, key: 'botanical_name', value: 'Propolis cera' },
        { id: 2, key: 'flavor_notes', value: 'Balsamiczny, Żywica leśna' },
      ],
    };

    const mapped = mapWooProductToHoneyProduct(raw);

    expect(mapped.id).toBe('propolis-kit');
    expect(mapped.wooId).toBe(74);
    expect(mapped.category).toBe('z-dodatkami');
    expect(mapped.imageUrl).toBe(
      'https://www.sklep.pasiekausza.pl/wp-content/uploads/2026/10/oferta-propolis.jpg'
    );
    expect(mapped.images).toEqual([
      'https://www.sklep.pasiekausza.pl/wp-content/uploads/2026/10/oferta-propolis.jpg',
    ]);
    expect(mapped.flavorNotes).toEqual(['Balsamiczny', 'Żywica leśna']);
    expect(mapped.sizes[0]?.pricePln).toBe(25);
  });
});
