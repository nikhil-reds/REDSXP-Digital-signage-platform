import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface AccessDeniedCardProps {
  resource: string;
  roleName?: string | null;
  backHref?: string;
}

export function AccessDeniedCard({
  resource,
  roleName,
  backHref = "/agent",
}: AccessDeniedCardProps) {
  return (
    <Card size="panel" className="flex min-h-[400px] items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-app-accent-surface text-app-accent-text">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-caption font-semibold uppercase tracking-[0.16em] text-app-accent-text">
          Access restricted
        </p>
        <h2 className="mt-2 font-heading text-h5 font-semibold tracking-headline text-app-text">
          You don&apos;t have access to {resource}.
        </h2>
        <p className="mt-3 text-body text-app-muted">
          {roleName
            ? `Your ${roleName} role does not include access to this area.`
            : "Your current role does not include access to this area."} Ask a workspace administrator to update your permissions.
        </p>
        <Button as={Link} href={backHref} variant="secondary" size="sm" icon={ArrowLeft} className="mt-6">
          Back to overview
        </Button>
      </div>
    </Card>
  );
}
