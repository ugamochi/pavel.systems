# Refactoring Suggestions

Updated: 2026-02-18

## Already Completed in This Pass

1. Replaced six duplicated service page implementations with one shared renderer and one shared data model:
Path: `js/modules/service-page-renderer.js`, `js/data/service-pages.js`, `services/*/index.html`

2. Removed inline nav handlers in HTML and centralized behavior in JS modules:
Path: `js/modules/nav.js`, `index.html`, `services/*/index.html`

3. Improved form extensibility by sending dynamic fields (e.g., `intent`, `service_requested`) without custom form code per page:
Path: `js/modules/form.js`

4. Added dedicated discovery call route to separate booking intent from generic project intake:
Path: `book-discovery-call/index.html`, `js/book-call.js`

## Next Refactors (Recommended)

1. Introduce shared layout partial generation:
Current service shells still repeat nav/footer markup. Generate static HTML shells from one template script before deployment.

2. Split service page renderer by section components:
Break `renderServiceMarkup()` into focused functions by section and move shared card renderers into helper utilities.

3. Move copy data into versioned JSON-like content files per service:
Keep core metadata in `js/data/service-pages.js`, but move long copy blocks to one file per service for easier review workflow.

4. Add lightweight content validation checks:
Create a script to validate required service keys (`title`, `pricing`, `faqs`, `packages`) and fail CI on missing fields.

5. Add HTML linting and broken-link checks in CI:
Static site regressions are currently only caught manually.

6. Normalize naming between website slugs and workspace docs folders:
Example: website uses `openclaw-setup-security-hardening`, docs folder currently differs.

7. Add error telemetry for form submissions:
Capture fetch failures with a lightweight monitoring endpoint to detect webhook outages quickly.

8. Formalize design tokens for service-level theming:
Current service accent overrides are runtime style assignments. A token map + utility class approach would improve long-term maintainability.
