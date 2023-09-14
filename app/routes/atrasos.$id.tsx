import { json, Response } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Container } from "~/components/container";
import { getDelayById } from "~/models/delay.server";
import { getUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  invariant(params.id, "O ID da denúnica não foi encontrado");

  const delay = await getDelayById(params.id);
  if (!delay) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ isOwner: delay.user.id === userId });
};

export default function SingleDelayRoute() {
  return (
    <Container className="max-w-xl">
      <Outlet />
    </Container>
  );
}
