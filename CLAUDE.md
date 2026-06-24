# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Start everything (Rails :3000 + Vite HMR)
bin/dev

# Individual processes
bin/rails server -p 3000
npx vite                        # or: bin/vite dev

# Database
bin/rails db:prepare            # create + migrate + seed
bin/rails db:migrate
bin/rails db:seed               # admin@example.com / demo@example.com (password123)

# TypeScript check (no test suite yet)
npx tsc --noEmit

# Rails console
bin/rails console
```

## Architecture

Rails 8.1 monolith + React 18 SPA in one repo, one deploy.

**Request flow:** Browser → Rails → `app#show` (catch-all) → React shell → React Router handles client routes. Data comes from JSON endpoints at `/api/v1/...`. The Rails catch-all excludes `/api`, `/assets`, `/rails`, `/up`.

**Auth:** Cookie session (`session[:user_id]`). `ApplicationController` provides `current_user` / `current_organization`. Every API controller inherits `Api::V1::BaseController` which runs two before-actions: `require_login` and `require_approved_organization`. Skip these selectively when needed (e.g. `AlumniMapController` skips both; `MeController` skips the org check).

**Frontend entry:** `app/javascript/entrypoints/application.tsx` → `App.tsx` (router + `AuthContext`). `useAuth()` gives `{ me, setMe, loading }` anywhere in the tree. `me` is `MeResponse | null` from `GET /api/v1/me`.

## Frontend structure

```
app/javascript/
  App.tsx                         # BrowserRouter, AuthContext, Nav, Protected, all routes
  features/
    auth/                         # Login, Register, Waitlist, Landing, Terms + types.ts
    map/                          # AlumniMap + types.ts, constants.ts (MAP_STYLE, MAP_VISIBILITIES)
    organization/                 # RegisterOrganization, OrgProfile + types.ts, constants.ts
    profile/                      # Account, LocationForm + types.ts
  shared/
    api/client.ts                 # apiClient (get/post/patch/delete with CSRF)
    ui/                           # Button, TextField, Select, TextArea, Checkbox, CheckboxGroup, FormError, FormStack
    constants/countries.ts        # COUNTRIES array + countryName()
  types.ts / constants.ts / api.ts  # shims — re-export from features/shared; don't add new code here
```

New features go in `features/<name>/` with co-located `types.ts` and `constants.ts`. Import `apiClient` from `shared/api/client`, UI from `shared/ui`, countries from `shared/constants/countries`.

The map route (`/app/alumni-map`) hides the nav by default. `AppRoutes` owns nav visibility state; `Protected` passes it down. The `NavToggleButton` (fixed, top-right) is rendered only on the map route.

## Backend structure

Plain-Ruby serializers in `app/serializers/` — no gems. `OrganizationSerializer.call(org, contact: true/false)` gates OID and member emails behind the `contact` flag (only for own org or accepted connections). `MeSerializer.call(user)` is the standard shape returned after any auth mutation.

**Authorization pattern:** Controllers check `current_user.organization_id == org.id && current_user.org_admin?` directly for owner-only actions. No Pundit yet — keep auth in controllers/models until rules grow.

## Data model key points

- `users.organization_id` is the legacy single-org FK used by `MeSerializer` and the waitlist guard. It stays.
- Multi-org support is via `memberships` (user, organization, role: `owner`|`participant`). A user can own one org (via the FK) and appear as a participant in others via memberships.
- `projects` belong to an `organization`. `project_participants` joins users to projects.
- `organizations.status` (`waitlisted` → `approved`|`rejected`) gates access. Only `admin` users bypass this.
- Array columns (`key_actions`, `expertises`, `languages`) use PostgreSQL native arrays with GIN indexes.

## Routes

```
POST   /api/v1/session                        # login
DELETE /api/v1/session                        # logout
POST   /api/v1/registration                   # sign up
GET    /api/v1/me                             # current user + org (skips org check)
DELETE /api/v1/me                             # GDPR delete
PATCH  /api/v1/me/update_location
POST   /api/v1/organizations                  # create org (skips org check)
GET    /api/v1/organizations/:id              # org profile + projects + viewer_role
POST   /api/v1/organizations/:id/projects     # create project (owner only)
GET    /api/v1/organizations/:id/projects     # list projects
GET    /api/v1/alumni_map                     # public map pins (skips both guards)
PATCH  /api/v1/password
POST   /api/v1/password_reset
PATCH  /api/v1/password_reset
PATCH  /api/v1/admin/organizations/:id/approve
PATCH  /api/v1/admin/organizations/:id/reject
```

## CSS

Tailwind v4 via `@tailwindcss/vite`. Custom tokens in `application.tailwind.css`: `--color-eu-blue: #1f4e9c`, `--color-eu-yellow: #ffd617`. Utility classes defined in `@layer components`: `.nav`, `.card`, `.btn`, `.btn.secondary`, `.btn.danger`, `.badge`, `.badge.open/.urgent/.pending`, `.container`, `.container.wide`, `.muted`, `.error`, `.row`, `.filters`, `.tabs`, `ul.clean`.
