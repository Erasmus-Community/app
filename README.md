# Erasmus+ NGO Hub

Platform for NGOs working on Erasmus+ projects: find partners for Key Action applications, recruit participants for approved projects (with urgent dropout replacement), and collaborate during ongoing projects.

Docs: [PRD](docs/PRD.md) · [Architecture & data model](docs/ARCHITECTURE.md)

## Stack

Rails 8.1 monolith · React 18 (esbuild via jsbundling-rails) · Tailwind CSS v4 (via cssbundling-rails) · PostgreSQL · session auth

## Requirements

- Ruby 4.0.3 (`.ruby-version`)
- Node 20+ and npm
- PostgreSQL 14+

## Setup

```sh
bundle install
npm install
bin/rails db:prepare
bin/rails db:seed    # admin + demo data
bin/dev              # Rails on :3000 + esbuild & tailwind --watch (uses foreman)
```

Logins after seeding: `admin@example.com` / `password123` (platform admin), `demo@example.com` / `password123` (approved demo NGO).

## How it works

- `/` is a public landing page explaining the platform.
- New NGOs register at `/register` and land on a waitlist; a platform admin approves them at `/admin`.
- Approved orgs: search the partner directory, send connection requests (contacts revealed on accept), create projects, post participant vacancies (urgent ones float to the top of the board), and use per-project workspaces (tasks, shared links, participant roster, partners).
- Each vacancy has a public shareable page at `/v/:token` (no login needed).

## Deliberately out of MVP

Participant accounts, email notifications, file uploads (Active Storage), in-app chat, automated matching. See the PRD for the roadmap.
