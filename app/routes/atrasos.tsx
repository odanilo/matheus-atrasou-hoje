import { Outlet } from "@remix-run/react";
import { Nav } from "~/components/nav";
import { useOptionalUser } from "~/utils";

export default function AtrasosRoute() {
  const user = useOptionalUser();

  return (
    <div className="flex min-h-full flex-col">
      <header>
        <Nav userId={user?.id} />
      </header>

      <main className="mt-8">
        <Outlet />
      </main>
    </div>
  );
}
