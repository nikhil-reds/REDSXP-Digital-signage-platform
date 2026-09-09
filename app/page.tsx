import Image from "next/image";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070d1e] p-4 text-reds-offwhite sm:p-6 lg:p-8">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-white/10 bg-[#0a1226] shadow-2xl shadow-black/30 sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.5fr)]">
        <section className="relative flex min-h-[360px] flex-col justify-between overflow-hidden border-b border-white/10 bg-[#091127] px-7 py-8 sm:px-10 sm:py-11 lg:min-h-0 lg:border-r lg:border-b-0 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-reds-green-60/15 blur-[100px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 opacity-80"
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

          <div className="relative my-8 flex flex-col items-start lg:my-0">
            <Image
              src="/reds-tag.svg"
              alt="REDS — Rubenious Experiential Design System"
              width={720}
              height={420}
              className="-ml-9 h-48 w-auto object-contain sm:-ml-12 sm:h-56 lg:-ml-14 lg:h-64"
              priority
            />
          </div>

          <p className="relative max-w-sm border-l border-reds-green-60/60 pl-4 text-body text-reds-cool-40">
            REDS gives teams one calm, intelligent space to create, govern, and
            scale their digital signage network.
          </p>
        </section>

        <section className="bg-[#0d162d] px-7 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-14">
          <div className="flex max-w-3xl items-start justify-between gap-6">
            <div>
              <p className="text-caption font-medium uppercase tracking-[0.2em] text-reds-green-40">
                Platform capabilities
              </p>
              <h2 className="mt-3 font-heading text-h4 font-medium tracking-headline text-reds-offwhite sm:text-h3">
                Built for experiences that stay in motion.
              </h2>
              <p className="mt-3 max-w-xl text-lead text-reds-cool-40">
                A unified content operations platform for teams that need every
                screen, campaign, and location working together.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full border border-reds-green-60/30 bg-reds-green-60/10 px-3 py-1.5 text-caption font-medium text-reds-green-40 sm:block">
              10 features
            </span>
          </div>

          <ol className="mt-8 grid gap-x-8 border-t border-white/10 sm:grid-cols-2">
            {cmsFeatures.map(([number, title, description]) => (
              <li key={number} className="group border-b border-white/10 py-5">
                <div className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-reds-green-60/10 text-caption font-semibold text-reds-green-40 transition-colors group-hover:bg-reds-green-60 group-hover:text-reds-black">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-heading text-lead font-medium tracking-headline text-reds-offwhite">
                      {title}
                    </h3>
                    <p className="mt-1 text-body text-reds-cool-40">{description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
