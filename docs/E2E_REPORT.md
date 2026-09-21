# E2E Flow Report

Browser journeys (Playwright/Chromium) against the live stack — 2026-09-19T06:47:48.160586299.
These are runtime UI journeys: everything here already compiled and booted.

**0 of 19 journeys passed.**

## Failure clusters (fix the cause once → many flows recover)

### Error: page.goto: net::ERR_CONNECTION_REFUSED at http://eNe-…  (19)
- **owner can create a new membership plan** (adminportal.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **owner can edit an existing membership plan** (adminportal.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an owner to complete onboarding and create a workspace** (authui.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to log in and view the memberships page** (checkoutflow.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to create a new membership plan** (checkoutflow.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to log in and view the memberships page** (customeraccount.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to create a new membership** (customeraccount.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to edit an existing membership** (customeraccount.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to delete an existing membership** (customeraccount.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **owner can create a new membership plan** (eventdisplay.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to log in and view the memberships page** (productcatalog.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to create a new membership** (productcatalog.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to edit an existing membership** (productcatalog.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to delete an existing membership** (productcatalog.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to log in and view the memberships page** (shoppingcart.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to create a new membership plan** (shoppingcart.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to edit an existing membership plan** (shoppingcart.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an admin to delete a membership plan** (shoppingcart.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login
- **should allow an owner to complete onboarding after login** (staticpages.spec.ts) — Error: page.goto: net::ERR_CONNECTION_REFUSED at http://e2e-9b26a692:8080/login

## Passing (0)

