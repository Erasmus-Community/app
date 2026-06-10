# Architecture & Data Model

## Stack

- Rails 8.1 monolith (Ruby 4.0), PostgreSQL 14+
- React 18 mounted inside Rails via `jsbundling-rails` + esbuild (single repo, single deploy)
- Rails serves a single `app#show` shell view; React Router handles client routes; data via JSON endpoints under `/api/v1`
- Session-based auth (cookies, `has_secure_password`) — no JWT needed in a same-origin monolith
- Solid Queue/Cache/Cable kept from the default skeleton for production (separate Postgres databases)
- Hotwire was removed; React is the chosen frontend

## Layout

```
app/
  controllers/
    application_controller.rb        # session auth, current_organization
    app_controller.rb                # React shell (root + catch-all)
    api/v1/...                       # JSON controllers (one per resource)
    api/v1/admin/organizations_...   # waitlist approval
    api/v1/public/vacancies_...      # unauthenticated shareable vacancy page
  models/
  serializers/                       # plain-Ruby serializers
  views/app/show.html.erb            # React mount point
  javascript/
    application.jsx                  # entry
    App.jsx                          # router + auth context
    pages/...                        # feature slices
db/migrate/
```

## Data model

```
organizations
  name, country(ISO2), oid, website, description,
  status: waitlisted|approved|rejected (default waitlisted),
  key_actions text[] (KA1/KA2/KA3), expertises text[], languages text[]

users
  organization_id FK, name, email (unique, lower-indexed), password_digest,
  org_role: member|org_admin, admin: boolean (platform admin)

connections                          # contact exchange
  requester_id -> organizations, addressee_id -> organizations,
  status: pending|accepted|declined, message
  unique (requester_id, addressee_id); contacts revealed only when accepted

projects
  organization_id FK (lead), title, key_action, project_type
  (youth_exchange|training_course|job_shadowing|strategic_partnership|other),
  venue_country, starts_on, ends_on, description,
  status: planning|ongoing|completed

project_partnerships                 # shared workspace membership
  project_id, organization_id, unique pair

vacancies                            # participant recruitment
  project_id FK, title, slots, participant_profile, countries text[] (eligible sending),
  deadline, urgent: boolean, status: open|filled|expired,
  public_token (unique, has_secure_token, shareable public page)

vacancy_interests
  vacancy_id, organization_id, participant_count, message,
  status: pending|accepted|declined; unique (vacancy_id, organization_id)

project_tasks                        # tools slice
  project_id, title, due_on, completed_at, assignee_organization_id (nullable)

project_resources
  project_id, organization_id (who added), title, url, kind: link|file

roster_entries                       # participant roster (minimal PII — GDPR)
  project_id, organization_id (sending org), full_name, email, notes
```

## Key rules

- Every authenticated request requires `current_user.organization.approved?` except the waitlist status screen (`/api/v1/me`) and admin endpoints.
- Contact details (OID, member emails) are serialized only for the own org or accepted connections.
- Urgent vacancies sort first on the board; the `public_token` page is the only unauthenticated read.
- Project workspace endpoints authorize via `project_partnerships` (lead org always has access); only the lead org manages partners and vacancies.
- Partners can only be added from the org's accepted-connection network.
- Authorization kept in controllers/models for MVP; introduce Pundit when rules grow.

## Future (out of MVP)

- Solid Queue email notifications for urgent vacancies (country-matched)
- Participant accounts, automated partner matching, in-app chat
- Active Storage for file uploads (MVP stores links; the `kind` column anticipates files)
