import Image from "next/image";
import Link from "next/link";

interface HomeNavbarProps {
  /** Dashboard URL when the visitor already has a valid session. */
  dashboardHref: string | null;
}

export default function HomeNavbar({ dashboardHref }: HomeNavbarProps) {
  const primary = dashboardHref
    ? { href: dashboardHref, label: "Go to dashboard" }
    : { href: "/login", label: "Sign in" };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070d1e]/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-2 sm:px-3 lg:px-4"
      >
        <Link href="/" aria-label="REDS XOS home" className="flex shrink-0 items-center">
          <Image
            src="/reds-xos-logo.png"
            alt="REDS XOS"
            width={160}
            height={40}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <Link
          href={primary.href}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-reds-green-60 px-4 font-heading text-body font-medium text-reds-black transition-colors hover:bg-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40"
        >
          {primary.label}
        </Link>
      </nav>
    </header>
  );
}
