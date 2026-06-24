import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../App";

interface Feature {
  title: string;
  text: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Find trusted partners",
    text: "Search a vetted directory of Erasmus+ NGOs by country, Key Action and field of expertise. Exchange contacts through connection requests and build the consortium for your next KA1, KA2 or KA3 application.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6S13.9 16 14.5 19" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.5 14.7c2.7 0 4.5 1.4 5 4.3" />
      </svg>
    ),
  },
  {
    title: "Fill participant slots — fast",
    text: "Post vacancies for approved projects and reach sending organizations across Europe. When a participant drops out days before a mobility, flag it urgent and it jumps to the top of the board.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2Z" />
      </svg>
    ),
  },
  {
    title: "Run projects together",
    text: "Every project gets a shared workspace for all partner organizations: task checklists with deadlines, a participant roster, and a library of links — infopacks, drive folders, dissemination material.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 9h18M8 13h4M8 16.5h7" />
      </svg>
    ),
  },
];

const steps: [string, string][] = [
  [
    "Register your NGO",
    "Tell us who you are: country, Erasmus+ OID, Key Actions and expertise. Registration takes two minutes.",
  ],
  [
    "Get approved",
    "Every organization is reviewed before joining, so the directory stays a trusted space of real Erasmus+ actors.",
  ],
  [
    "Start collaborating",
    "Connect with partners, post or answer participant vacancies, and manage ongoing projects in shared workspaces.",
  ],
];

function Stars() {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + 38 * Math.cos(angle);
    const y = 50 + 38 * Math.sin(angle);
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fill="currentColor"
      >
        ★
      </text>
    );
  });
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {stars}
    </svg>
  );
}

export default function Landing() {
  const { me, loading } = useAuth();
  const inApp = !loading && me;

  return (
    <div className="min-h-screen bg-white">
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-bold text-white">Erasmus+ NGO Hub</span>
          <nav className="flex items-center gap-3">
            {inApp ? (
              <Link
                to="/app/alumni-map"
                className="rounded-md bg-eu-yellow px-4 py-2 text-sm font-semibold text-eu-blue-dark hover:brightness-95"
              >
                Go to the app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-eu-yellow px-4 py-2 text-sm font-semibold text-eu-blue-dark hover:brightness-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-linear-to-br from-eu-blue-dark via-eu-blue to-blue-500 pt-32 pb-24 text-white">
        <div className="pointer-events-none absolute -top-16 -right-16 h-96 w-96 text-eu-yellow/25">
          <Stars />
        </div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            For NGOs running Erasmus+ projects
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-extrabold sm:text-5xl">
            Find partners. Fill participant slots.
            <br className="hidden sm:block" />
            <span className="text-eu-yellow">
              {" "}
              Run smoother Erasmus+ projects.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            One platform where vetted organizations exchange contacts for future
            Key Action applications, recruit participants for approved projects
            — including urgent last-minute replacements — and coordinate the
            work while projects run.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {!inApp && (
              <Link
                to="/register"
                className="rounded-lg bg-eu-yellow px-6 py-3 text-base font-bold text-eu-blue-dark shadow-lg hover:brightness-95"
              >
                Create your account
              </Link>
            )}
            <Link
              to={inApp ? "/app/alumni-map" : "/login"}
              className="rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
            >
              {inApp ? "Go to the map" : "I already have an account"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="m-0 text-center text-3xl font-bold text-gray-900">
          Everything a project consortium needs
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-500">
          Built around the real lifecycle of an Erasmus+ project: from finding
          partners, to filling every funded slot, to delivering together.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-7 transition-shadow hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-xl bg-eu-blue/10 p-3 text-eu-blue">
                {f.icon}
              </div>
              <h3 className="m-0 text-lg font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 md:flex-row md:items-center">
          <div className="flex-1">
            <span className="mr-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold tracking-wide">
              URGENT
            </span>
            <h2 className="mt-3 mb-0 text-2xl font-bold text-white">
              A participant dropped out a week before the exchange?
            </h2>
            <p className="mt-3 max-w-2xl text-gray-300">
              Don't lose the grant for that slot. Mark the vacancy urgent and
              it's pushed to the top of the board for every sending organization
              in the eligible countries — plus a public link you can share
              anywhere.
            </p>
          </div>
          <Link
            to={inApp ? "/app/vacancies" : "/register"}
            className="shrink-0 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            {inApp ? "See urgent vacancies" : "Get access"}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="m-0 text-center text-3xl font-bold text-gray-900">
          How it works
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <div key={title} className="relative">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-eu-blue text-base font-bold text-white">
                {i + 1}
              </div>
              <h3 className="m-0 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {text}
              </p>
            </div>
          ))}
        </div>
        {!inApp && (
          <div className="mt-16 rounded-2xl bg-linear-to-r from-eu-blue-dark to-eu-blue p-10 text-center text-white">
            <h2 className="m-0 text-2xl font-bold text-white">
              Ready to join the network?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-blue-100">
              Access is limited to verified NGOs. Register today and we'll
              review your organization shortly.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-block rounded-lg bg-eu-yellow px-8 py-3 font-bold text-eu-blue-dark hover:brightness-95"
            >
              Sign up free
            </Link>
          </div>
        )}
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-gray-500">
          <span>Erasmus+ NGO Hub — built by NGOs, for NGOs.</span>
          <span>Not affiliated with the European Commission.</span>
        </div>
      </footer>
    </div>
  );
}
