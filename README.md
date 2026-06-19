# Portfolio

Personal portfolio application built with **Angular**.

This project is focused on clean frontend architecture, performance and maintainability, and is treated as a real application rather than a simple static website.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version **21.0.4**.

Production site:

```bash
https://davidgimenezrodriguez.com
```

---

## Development

### Local development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to:

```bash
http://localhost:4200/
```

The application will automatically reload whenever you modify any of the source files.

---

## Code scaffolding

Angular CLI includes powerful code scaffolding tools.

To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as components, directives or pipes), run

```bash
ng generate --help
```

---

## Build

To build the project, run:

```bash
ng build
```

This will compile the application and store the build artifacts in the dist/ directory.

By default, the production build optimizes the application for performance and speed.

### Analytics configuration

Analytics IDs are generated from environment variables and are not committed to the public repository.

```bash
GTM_CONTAINER_ID=GTM-XXXXXXX GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

For local development, copy `.env.example` to `.env.local` and fill in the values. `npm start` and `npm run build` generate `public/config/analytics.json`, which the app reads at runtime.

---

## Testing

### Unit tests

To execute unit tests using the [Vitest](https://vitest.dev/) test runner, run:

```bash
ng test
```

---

## Release workflow

- `develop` contains the latest work and the next release version.
- `main` contains the latest published release.
- Release stabilization happens in `release/x.y.z` branches.
- Published releases are marked with version tags.

Before cutting a release branch, run:

```bash
npm run release:check
```

The sitemap is generated from the content files. Set `SITE_URL` when the production domain differs from the default `https://davidgimenezrodriguez.com`:

```bash
SITE_URL=https://example.com npm run sitemap
```

Release notes are maintained in [CHANGELOG.md](CHANGELOG.md).

Angular major upgrades are handled as dedicated releases so framework migration risk stays separate from content, SEO and deployment changes.

---

## Project status

This repository contains the production portfolio for `davidgimenezrodriguez.com`.
The project will continue evolving with new content, SEO improvements and release hardening over time.

---

## Additional resources

- Angular CLI documentation:  
  https://angular.dev/tools/cli
