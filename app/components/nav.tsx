import { Form, Link } from "@remix-run/react";
import { Button } from "./button";
import { Container } from "./container";

export function Nav({ userId }: { userId: string | undefined }) {
  return (
    <nav className="bg-zinc-900 py-6 border-b border-zinc-800">
      <Container>
        <ul className="flex flex-wrap gap-2 justify-end">
          <li>
            <Button
              as={Link}
              to="atrasos/novo"
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
