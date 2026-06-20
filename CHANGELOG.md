# Changelog

## 2.4.0 - 2026-06-20

### Fixed

- Restored navbar contrast and readability after replacing Bootstrap's global navbar styles.
- Improved mobile navbar spacing, toggle contrast and active navigation states.
- Aligned cards, footer links, content links, buttons and contact form controls with the dark UI theme.
- Removed negative heading letter spacing so hero and section titles render more consistently across viewports.

### Verified

- `npm run build`
- `npm test -- --watch=false`
- Browser checks for desktop and mobile navigation, contact, projects, project detail, experience and education views.

## 2.3.0 - 2026-06-20

### Changed

- Reduced initial load cost by removing FontAwesome from the navbar and replacing it with a lightweight local brand mark.
- Deferred analytics configuration and GTM initialization so they no longer block Angular startup.
- Removed the external Google Fonts stylesheet from the critical document path.
- Trimmed Bootstrap output by removing unused utilities, moving form styling to the contact route, replacing global badge/navbar CSS with local styles, and keeping only the utility classes used by the app.
- Reduced prerendered HTML by disabling HTTP transfer cache serialization for static JSON content and disabling incremental hydration for this portfolio.
- Added immutable cache headers for versioned JavaScript and CSS assets on Vercel.

### Fixed

- Removed duplicate Vercel Analytics pageview tracking so route views are emitted through the central analytics service only.

### Verified

- `npm run build -- --stats-json`
- `npm test -- --watch=false`
- Browser checks for the home page, contact page, and mobile navbar toggle.

## 2.0.0 - 2026-06-15

### Added

- Production domain support for `davidgimenezrodriguez.com`.
- Search-ready SEO metadata with canonical URLs, robots directives, Open Graph, Twitter cards and JSON-LD structured data.
- `Person`, `WebSite`, `WebPage`, `CreativeWork` and `BreadcrumbList` schema output.
- Generated `sitemap.xml` and `robots.txt` workflow.
- Vercel security headers for content type sniffing, framing, referrer behavior and browser permissions.

### Changed

- `www.davidgimenezrodriguez.com` redirects permanently to the root domain.
- 404 routes are marked as `noindex,follow`.
- Release version bumped to `2.0.0`.

### Verified

- `npm run release:check`
- Google Search Console domain verification.
- Sitemap submission with 12 valid URLs.
