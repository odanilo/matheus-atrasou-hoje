import { Form, Link } from "@remix-run/react";
import { Button } from "./button";
import { Container } from "./container";
import { Logo } from "./logo";

export function Nav({
  userId,
  hasLogo = true,
}: {
  userId: string | undefined;
  hasLogo?: boolean;
}) {
  return (
    <nav className="bg-zinc-900 py-6 border-b border-zinc-800">
      <Container className="flex flex-wrap gap-4 justify-between items-center">
        {hasLogo && (
          <Link to="/" prefetch="intent" className="flex max-w-[200px]">
            <Logo />
          </Link>
        )}
        <ul className="flex flex-wrap gap-2 justify-end ml-auto">
          <li>
            <Button
              as={Link}
              to="/atrasos/novo"
              prefetch="intent"
              variant="primary"
            >
              Denunciar atraso
            </Button>
          </li>
          <li>
            {userId ? (
              <Form action="/logout" method="post">
                <Button type="submit" variant="secondary">
                  Sair
                </Button>
              </Form>
            ) : (
              <Button
                as={Link}
                to="/login"
                prefetch="intent"
                variant="secondary"
              >
                Entrar
              </Button>
            )}
          </li>
        </ul>
      </Container>
    </nav>
  );
}
