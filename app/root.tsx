import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { ServerCrash } from "lucide-react";
import type { PropsWithChildren } from "react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { Logo } from "./components/logo";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

function Document({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://use.typekit.net/lzl4cqa.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
        <meta
          name="description"
          content="Quem é amigo de @matheussoe sabe que ele construiu toda uma reputação por atrasos. Esse site de incentivarmos que ele pare com isso."
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://matheus-atrasou-hoje.fly.dev/"
        />
        <meta
          property="og:title"
          content="Matheus Atrasou Hoje? — Denuncie quando nosso amigo atrasar"
        />
        <meta
          property="og:description"
          content="Quem é amigo de @matheussoe sabe que ele construiu toda uma reputação por atrasos. Esse site de incentivarmos que ele pare com isso."
        />
        <meta
          property="og:image"
          content="https://matheus-atrasou-hoje.fly.dev/social-matheus-atrasou-hoje.jpg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://matheus-atrasou-hoje.fly.dev/"
        />
        <meta
          property="twitter:title"
          content="Matheus Atrasou Hoje? — Denuncie quando nosso amigo atrasar"
        />
        <meta
          property="twitter:description"
          content="Quem é amigo de @matheussoe sabe que ele construiu toda uma reputação por atrasos. Esse site de incentivarmos que ele pare com isso."
        />
        <meta
          property="twitter:image"
          content="https://matheus-atrasou-hoje.fly.dev/social-matheus-atrasou-hoje.jpg"
        />
      </head>
      <body className="h-full bg-zinc-950 text-zinc-50">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <Document>
      <div className="h-full w-full flex items-center justify-center">
        <section className="flex flex-col gap-4 w-full max-w-md">
          <header className="flex flex-col items-center gap-2 text-zinc-200 text-center">
            <ServerCrash role="presentation" size={32} />
            <h2 className="text-xl">Desculpa, aconteceu algo inesperado!</h2>
            <p className="text-zinc-400">
              Por favor, tente novamente mais tarde. Além disso, você pode
              mandar uma mensagem pro e-mail{" "}
              <a href="&#109;&#97;i&#108;t&#111;&#58;da&#37;6&#69;%&#50;Enu&#110;&#101;%730&#64;g%&#54;&#68;%&#54;&#49;%69&#37;6C&#37;2E%63%6Fm">
                d&#97;n&#46;nu&#110;es0&#64;&#103;m&#97;il&#46;com
              </a>{" "}
              e reportar esse erro.
            </p>
          </header>
          <main className="flex flex-col gap-1 rounded-lg p-6 bg-red-600/20">
            <h1>App Error</h1>
            <pre>{errorMessage}</pre>
          </main>
          <footer className="flex justify-center">
            <Link to="/" prefetch="intent" className="max-w-[250px]">
              <Logo />
            </Link>
          </footer>
        </section>
      </div>
    </Document>
  );
}
