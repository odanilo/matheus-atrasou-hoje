import { Link } from "@remix-run/react";
import { Container } from "./container";
import { Logo } from "./logo";
import type { HTMLAttributes } from "react";
import { cn } from "~/utils/misc";

export function Footer({
  hasLogo = true,
  className,
  ...props
}: { hasLogo?: boolean } & HTMLAttributes<HTMLElement>) {
  const classes = cn(className, "bg-zinc-900 py-6 border-b border-zinc-800");

  return (
    <footer {...props} className={classes}>
      <Container className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Por que esse site é importante?
        </h2>
        <p>
          A dolorosa verdade é que estamos sempre sendo enganados por Matheus,
          manter um histórico de suas mentiras é uma forma de fazer com que a
          história não se repita.
        </p>
        <p>
          Essa também é uma oportunidade de Matheus se desafiar a manter e
          quebrar vários dias sem se atrasar e esquecer pessoas no cabeleireiro
          antes de ir pra uma formatura.
        </p>
        <p>
          Conto com a contribuição de todos e agradeço por participarem dessa
          grande brincadeira!
        </p>

        {hasLogo && (
          <Link to="/" prefetch="intent" className="flex max-w-[200px]">
            <Logo />
          </Link>
        )}
      </Container>
    </footer>
  );
}
