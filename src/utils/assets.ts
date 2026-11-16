import type React from 'react';

export const DEFAULT_PRODUCT_IMAGE =
  'https://pasiekausza.pl/wp-content/uploads/2022/02/miod-wielokwaitowy-650x650.jpg';

/**
 * Shared `onError` handler for product and catalog images.
 * Rewrites `sklep.pasiekausza.pl` to `www.sklep.pasiekausza.pl` to match the SSL SAN cert,
 * and falls back once to `DEFAULT_PRODUCT_IMAGE` if loading still fails.
 */
export function handleProductImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl: string = DEFAULT_PRODUCT_IMAGE
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;
  if (
    currentSrc.includes('sklep.pasiekausza.pl') &&
    !currentSrc.includes('www.sklep.pasiekausza.pl')
  ) {
    target.src = currentSrc.replace('sklep.pasiekausza.pl', 'www.sklep.pasiekausza.pl');
  } else if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    target.src = fallbackUrl;
  }
}

/**
 * Utility for resolving static asset URLs from the /public directory.
 * Ensures assets resolve properly both in local development and when deployed
 * under a repository subpath on GitHub Pages (e.g. /pasieka-wedrowna-usza/).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (typeof window !== 'undefined') {
    // Dynamic repository subpath detection for GitHub Pages (*.github.io/<repo>/)
    if (window.location.hostname.includes('github.io')) {
      const segments = window.location.pathname.split('/').filter(Boolean);
      // The first segment of path on github.io is the repository name
      if (segments.length > 0 && !segments[0].includes('.')) {
        return `/${segments[0]}/${cleanPath}`;
      }
    }
  }

  const baseUrl = (import.meta as any).env?.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
}
