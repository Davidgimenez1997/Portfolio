# Changelog

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
