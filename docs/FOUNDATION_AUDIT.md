# Foundation Impedance Audit

Advisory — residual foundation impedance in generated code (Phase 4 detection net). Auto-rewrite arrives with the Phase 3 identity primitive.

<!-- AUDIT:BACKEND:START -->
## BACKEND

Clean — no residual foundation impedance.
<!-- AUDIT:BACKEND:END -->

<!-- AUDIT:FRONTEND:START -->
## FRONTEND

1 finding(s). The domain reference to the platform user should be the foundation handle `userId`.

### REDECLARED_USER_SHAPE (1)
- `frontend/src/components/account/ProfileDetails.tsx:3` — type AuthUser = { username: string; role: string };
<!-- AUDIT:FRONTEND:END -->
