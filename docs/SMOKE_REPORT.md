# Smoke Flow Report

Probed live at `http://smoke-9b26a692:8080` — 40 of 44 journeys working.

These are runtime journeys, not compilation. Everything below compiled cleanly.

## Broken (4)

- **unauth POST /api/v1/reviews** — 500 — reachable WITHOUT authentication; the security matcher does not cover the path this controller actually serves
- **unauth POST /api/v1/orders** — 400 — reachable WITHOUT authentication; the security matcher does not cover the path this controller actually serves
- **unauth GET /api/v1/orders** — 200 — reachable WITHOUT authentication; the security matcher does not cover the path this controller actually serves
- **unauth GET /api/v1/orders/{orderId}** — 404 — reachable WITHOUT authentication; the security matcher does not cover the path this controller actually serves

## Working (40)

- public GET /api/v1/products — 200
- public GET /api/v1/products/categories — 200
- public GET /api/v1/products/brands — 200
- public GET /api/v1/orders — 200
- public GET /api/v1/events/upcoming — 200
- admin login — 200 as owner@yourbusiness.com (seeded by application.properties)
- admin GET /api/v1/admin/products — 200
- admin GET /api/v1/admin/products/categories — 200
- admin GET /api/v1/admin/products/brands — 200
- admin GET /api/v1/admin/orders — 200
- admin GET /api/v1/admin/reviews — 200
- admin GET /api/v1/admin/reviews/pending — 200
- admin GET /api/v1/admin/events — 200
- unauth POST /api/v1/admin/products — 403 (rejected — good)
- unauth PUT /api/v1/admin/products/{id} — 403 (rejected — good)
- unauth DELETE /api/v1/admin/products/{id} — 403 (rejected — good)
- unauth PUT /api/v1/admin/products/{id}/stock — 403 (rejected — good)
- unauth GET /api/v1/admin/products — 403 (rejected — good)
- unauth GET /api/v1/admin/products/{id} — 403 (rejected — good)
- unauth GET /api/v1/admin/products/categories — 403 (rejected — good)
- unauth POST /api/v1/admin/products/categories — 403 (rejected — good)
- unauth PUT /api/v1/admin/products/categories/{id} — 403 (rejected — good)
- unauth DELETE /api/v1/admin/products/categories/{id} — 403 (rejected — good)
- unauth GET /api/v1/admin/products/brands — 403 (rejected — good)
- unauth POST /api/v1/admin/products/brands — 403 (rejected — good)
- unauth PUT /api/v1/admin/products/brands/{id} — 403 (rejected — good)
- unauth DELETE /api/v1/admin/products/brands/{id} — 403 (rejected — good)
- unauth GET /api/v1/admin/orders — 403 (rejected — good)
- unauth GET /api/v1/admin/orders/{orderId} — 403 (rejected — good)
- unauth PUT /api/v1/admin/orders/{orderId}/status — 403 (rejected — good)
- unauth POST /api/v1/admin/events — 403 (rejected — good)
- unauth GET /api/v1/admin/events — 403 (rejected — good)
- unauth GET /api/v1/admin/events/{id} — 403 (rejected — good)
- unauth PUT /api/v1/admin/events/{id} — 403 (rejected — good)
- unauth DELETE /api/v1/admin/events/{id} — 403 (rejected — good)
- unauth GET /api/v1/admin/reviews — 403 (rejected — good)
- unauth GET /api/v1/admin/reviews/pending — 403 (rejected — good)
- unauth PUT /api/v1/admin/reviews/{reviewId}/approve — 403 (rejected — good)
- unauth PUT /api/v1/admin/reviews/{reviewId}/reject — 403 (rejected — good)
- unauth DELETE /api/v1/admin/reviews/{reviewId} — 403 (rejected — good)
