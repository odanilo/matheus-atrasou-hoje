import { Outlet } from "@remix-run/react";
import { Container } from "~/components/container";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { Nav } from "~/components/nav";
import { useOptionalUser } from "~/utils";

export default function AtrasosRoute() {
  const user = useOptionalUser();
  return (
    <div className="flex min-h-full flex-col">
      <header>
        <Nav userId={user?.id} />
      </header>

      <main className="py-8 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const user = useOptionalUser();
  return (
    <div className="flex flex-col min-h-full">
      <Nav userId={user?.id} />
      <Container className="flex flex-1 flex-col items-center justify-center p-8">
        <GeneralErrorBoundary />
      </Container>
    </div>
  );
}
