import type React from 'react';
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRODUCT_IMAGE,
  getAssetUrl,
  handleProductImageError,
} from '../utils/assets';

describe('utils/assets', () => {
  it('returns external and data URLs unchanged', () => {
    expect(getAssetUrl('https://pasiekausza.pl/img.jpg')).toBe('https://pasiekausza.pl/img.jpg');
    expect(getAssetUrl('http://example.com/a.png')).toBe('http://example.com/a.png');
    expect(getAssetUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
    expect(getAssetUrl('')).toBe('');
  });

  it('normalizes relative asset paths with base URL', () => {
    expect(getAssetUrl('/assets/logo-usza.png')).toMatch(/assets\/logo-usza\.png$/);
    expect(getAssetUrl('assets/logo-usza.png')).toMatch(/assets\/logo-usza\.png$/);
  });

  it('rewrites non-www sklep.pasiekausza.pl image URLs on first error', () => {
    const img = {
      src: 'https://sklep.pasiekausza.pl/wp-content/uploads/2026/10/oferta-propolis.jpg',
      dataset: {} as DOMStringMap,
    } as HTMLImageElement;

    handleProductImageError({ currentTarget: img } as React.SyntheticEvent<HTMLImageElement>);

    expect(img.src).toBe(
      'https://www.sklep.pasiekausza.pl/wp-content/uploads/2026/10/oferta-propolis.jpg'
    );
    expect(img.dataset.fallbackApplied).toBeUndefined();
  });

  it('applies fallback image once when www URL still fails', () => {
    const img = {
      src: 'https://www.sklep.pasiekausza.pl/wp-content/uploads/missing.jpg',
      dataset: {} as DOMStringMap,
    } as HTMLImageElement;

    handleProductImageError({ currentTarget: img } as React.SyntheticEvent<HTMLImageElement>);
    expect(img.src).toBe(DEFAULT_PRODUCT_IMAGE);
    expect(img.dataset.fallbackApplied).toBe('true');

    // Second error should not overwrite or loop
    img.src = 'https://custom-broken.example/img.jpg';
    handleProductImageError({ currentTarget: img } as React.SyntheticEvent<HTMLImageElement>);
    expect(img.src).toBe('https://custom-broken.example/img.jpg');
  });
});
