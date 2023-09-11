import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
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
        <meta property="og:url" content="https://matheus-atrasou-hoje.fly.dev/" />
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
        <meta property="twitter:url" content="https://matheus-atrasou-hoje.fly.dev/" />
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
