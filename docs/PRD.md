# Problem/opportunity

NGOs running Erasmus+ projects face three recurring operational problems:

1. Partner discovery is fragmented. Applying for Key Action projects (KA1, KA2, KA3) requires consortiums of partner organizations across countries. Today NGOs find partners through informal Facebook groups, mailing lists, and word of mouth — slow, unreliable, and biased toward already-connected organizations.
2. Participant recruitment is ad hoc, and dropouts create urgent gaps. Once a project is approved, NGOs must fill participant slots (youth exchanges, training courses, etc.). When a participant drops days before a mobility, the sending organization scrambles to find a replacement or loses grant money for that slot.
3. No shared tooling for ongoing projects. Dissemination tracking, participant paperwork, deadlines, and inter-partner coordination are handled in scattered spreadsheets and email threads.

A single platform where vetted Erasmus+ NGOs maintain profiles, exchange contacts, post participant vacancies (with urgency flags), and use shared project tools addresses all three.

### Data to support the problem/opportunity

No supporting data provided yet — to be filled in. Suggested evidence to gather: size of Erasmus+ partner-search Facebook groups, EU funding lost to unfilled mobility slots, number of accredited organizations in the Erasmus+ database (OID holders).

# Solution

A web platform (Rails monolith + React, PostgreSQL) for Erasmus+ NGOs. Access is restricted to organizations: an NGO registers, joins a waitlist, and is approved by an admin before gaining access. Approved members of an organization get accounts under that org.

Three thin-slice MVP features:

1. Partner directory and contact exchange
   - Org profiles: country, OID, key actions of interest, fields of expertise (youth, sport, digital, inclusion, etc.), languages, past projects.
   - Search/filter by country, key action, expertise.
   - Connection requests: an org requests contact; on acceptance, contact details are revealed. Builds a "my network" list for future applications.

2. Participant recruitment for approved projects
   - Orgs post approved projects with participant slots: project type, dates, venue country, profile required, costs covered.
   - Urgent flag for last-minute dropouts; urgent vacancies surface at the top of the board.
   - Partner orgs respond on behalf of participants (NGO-only access model; participants do not have accounts in MVP). Public shareable link per vacancy so orgs can collect interest externally.

3. Project tools for ongoing projects
   - Per-project workspace shared between partner orgs: task checklist with deadlines, shared file/link library, participant roster.
   - MVP keeps this minimal: tasks, links, roster.

Out of scope for MVP: participant accounts, in-app messaging beyond connection requests, grant budgeting tools, mobile apps, automated matching.

## Design

Design pending — Figma link to be added.

## Acceptance Criteria

- Live on a single web platform (responsive desktop-first web app); no native apps.
- An unapproved NGO can register and sees a waitlist screen only; an admin can approve/reject from an admin panel; approval triggers an email (post-MVP: email delivery).
- Approved org members can: complete an org profile, search the directory, send/accept connection requests, see contact details only after acceptance.
- Approved org members can: post a project with vacancies, mark a vacancy urgent, browse/filter the vacancy board (urgent first), express interest in a vacancy, share a public vacancy link.
- Approved org members can: create a project workspace, invite partner orgs by connection, manage tasks with deadlines, add links, maintain a participant roster.
- Test is for all users — no segmentation at MVP launch.

## Events

- Registration funnel: org signup started, submitted, waitlist approved/rejected — measures top-of-funnel and vetting throughput.
- Directory: search performed (with filters used), profile viewed, connection requested, connection accepted — measures partner-finding liquidity.
- Recruitment: project posted, vacancy posted, urgent flag set, vacancy viewed, interest expressed, public link opened, vacancy filled — measures time-to-fill, especially for urgent vacancies.
- Tools: workspace created, partner invited, task created/completed, link added — measures retention-driving usage during projects.
- Error states: failed signup, rejected approval, expired vacancy — for funnel diagnostics.

## Experiment

Test name: N/A for MVP launch — new product, no control experience exists. First experiment candidate after launch: vb_urgent_notifications (vb = vacancy board), testing whether country-matched email notifications for urgent vacancies reduce time-to-fill.

Description: [To be defined post-launch]

### Test groups:

V0 (control): 50% [To be defined]

V1: 50% [To be defined]

Target metric:

- Time-to-fill for urgent vacancies; % vacancies filled
- C0

Guardrail:

- C1

What else to check:

- C2
- cancelations
- CTR

Expected MDE: [To be determined]

Expected users in the test: [To be determined]

Actual users in the test: [To be filled post-launch]

Mixpanel: [Placeholder — analytics tool to be confirmed]

## Conclusions

[To be filled after the experiment runs.]

## Recommendation

[To be filled after analyzing results.]

## Results

[To be filled after the experiment concludes.]
