import Image from "next/image";
import Link from "next/link";
import { getPortalHome } from "@/lib/session";

const cmsFeatures = [
  ["01", "Media library", "Keep images, videos, and documents organised in one secure place."],
  ["02", "Smart playlists", "Build engaging sequences with simple drag-and-drop scheduling."],
  ["03", "Content scheduling", "Publish the right message at the right time, across every screen."],
  ["04", "Screen management", "Monitor displays, players, and device health from a single view."],
  ["05", "Multi-site control", "Manage locations, teams, and content without switching platforms."],
  ["06", "Live updates", "Push urgent changes instantly whenever your audience needs them."],
  ["07", "Role-based access", "Give each team member exactly the access they need."],
  ["08", "Approval workflows", "Keep content on-brand with clear review and publishing steps."],
  ["09", "Analytics & proof of play", "See what ran, where it ran, and how your network is performing."],
  ["10", "Custom branding", "Deliver experiences that look and feel unmistakably yours."],
];

export default async function Home() {
  const dashboardHref = await getPortalHome();

  return (
    <div className="flex h-screen max-h-[100vh] w-screen max-w-[100vw] flex-col overflow-y-auto overflow-x-hidden bg-[#070d1e] text-reds-offwhite sm:overflow-hidden">
    <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:overflow-hidden sm:p-5 lg:p-6">
      <div className="grid h-auto min-h-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1226] shadow-2xl shadow-black/30 sm:h-full sm:min-h-0 sm:rounded-3xl lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.5fr)]">
        <section className="relative flex min-h-[280px] flex-col justify-between gap-6 overflow-hidden border-b border-white/10 bg-[#091127] px-5 py-6 sm:min-h-[320px] sm:px-10 sm:py-10 lg:min-h-0 lg:border-r lg:border-b-0 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-reds-green-60/15 blur-[100px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 opacity-60 sm:h-80 sm:w-80 sm:opacity-80"
          >
            <div className="absolute inset-0 rounded-full border border-reds-green-60/20" />
            <div className="absolute inset-7 rounded-full border border-dashed border-reds-green-60/25 animate-[reds-orbit_26s_linear_infinite]" />
            <div className="absolute inset-14 rounded-full border border-reds-green-40/25 animate-[reds-orbit-reverse_18s_linear_infinite]" />
            <div className="absolute inset-[5.8rem] rounded-full bg-reds-green-60/20 blur-2xl animate-[reds-signal_4s_ease-in-out_infinite]" />
            <span className="absolute left-9 top-1/2 h-2.5 w-2.5 rounded-full bg-reds-green-40 shadow-[0_0_16px_#0BDA51] animate-[reds-signal_3s_ease-in-out_infinite]" />
            <span className="absolute right-[4.5rem] top-11 h-2 w-2 rounded-full bg-reds-green-60 shadow-[0_0_14px_#0BDA51] animate-[reds-signal_3.8s_ease-in-out_infinite_0.5s]" />
            <span className="absolute bottom-14 right-10 h-1.5 w-1.5 rounded-full bg-reds-green-30 shadow-[0_0_12px_#0BDA51] animate-[reds-signal_3.2s_ease-in-out_infinite_1s]" />
          </div>
          <span className="relative inline-flex items-center gap-2 text-caption font-medium uppercase tracking-[0.22em] text-reds-green-40">
            <span className="h-2 w-2 rounded-full bg-reds-green-60 shadow-[0_0_14px_#0BDA51]" />
            REDS XOS
          </span>

          <div className="relative flex flex-col items-center justify-center gap-4 lg:my-0">
            <Image
              src="/reds-tag.svg"
              alt="REDS — Rubenious Experiential Design System"
              width={720}
              height={420}
              className="h-24 w-auto object-contain sm:h-32 lg:h-44"
              priority
            />
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="font-heading text-h6 font-medium tracking-headline text-reds-offwhite sm:text-h5">
                Enter to the REDS XOS
              </h1>
              <Link
                href={dashboardHref ?? "/login"}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-reds-green-60 px-6 py-3 font-heading text-body font-medium text-reds-black transition-colors hover:bg-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40"
              >
                {dashboardHref ? "Go to dashboard" : "Sign in"}
              </Link>
            </div>
          </div>

          <p className="relative max-w-sm border-l border-reds-green-60/60 pl-4 text-body text-reds-cool-40">
            REDS gives teams one calm, intelligent space to create, govern, and
            scale their digital signage network.
          </p>
        </section>

        <section className="min-h-0 overflow-hidden bg-[#0d162d] px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-7">
          <div className="flex max-w-3xl items-start justify-between gap-6">
            <div>
              <p className="text-caption font-medium uppercase tracking-[0.2em] text-reds-green-40">
                Platform capabilities
              </p>
              <h2 className="mt-2 font-heading text-h5 font-medium tracking-headline text-reds-offwhite sm:text-h5 lg:text-h5">
                Built for experiences that stay in motion.
              </h2>
              <p className="mt-2 max-w-xl text-body sm:text-body text-reds-cool-40">
                A unified content operations platform for teams that need every
                screen, campaign, and location working together.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full border border-reds-green-60/30 bg-reds-green-60/10 px-3 py-1.5 text-caption font-medium text-reds-green-40 sm:block">
              10 features
            </span>
          </div>

          <ol className="mt-4 grid min-h-0 grid-cols-1 gap-x-5 border-t border-white/10 sm:mt-6 sm:grid-cols-2 sm:gap-x-8">
            {cmsFeatures.map(([number, title, description]) => (
              <li key={number} className="group min-w-0 border-b border-white/10 py-2 sm:py-2.5">
                <div className="flex min-w-0 gap-2 sm:gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-reds-green-60/10 text-[10px] font-semibold text-reds-green-40 transition-colors group-hover:bg-reds-green-60 group-hover:text-reds-black sm:h-7 sm:w-7 sm:text-caption">
                    {number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-body font-medium tracking-headline text-reds-offwhite sm:text-body lg:text-lead">
                      {title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-reds-cool-40 sm:text-body lg:text-[13px]">{description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
    <footer className="flex min-h-11 shrink-0 items-center justify-between gap-4 border-t border-white/10 bg-[#070d1e] px-4 py-3 text-caption text-reds-cool-50 sm:px-6 lg:px-8">
      <span className="font-heading tracking-headline text-reds-green-40">REDS XOS</span>
      <span>© {new Date().getFullYear()} Rubenious</span>
    </footer>
    </div>
  );
}
