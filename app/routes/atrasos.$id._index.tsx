import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import type { DelayCardProps } from "~/components/delay-card";
import { DelayCard } from "~/components/delay-card";
import { getDelayById } from "~/models/delay.server";
import { getUserId } from "~/session.server";
import { formatDelayDate } from "~/utils/misc";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  invariant(params.id, "O ID da denúnica não foi encontrado");

  const delay = await getDelayById(params.id);
  if (!delay) {
    throw new Response("Not found", { status: 404 });
  }

  const formattedDelay: DelayCardProps = {
    body: delay.body,
    id: delay.id,
    title: delay.title,
    user: {
      firstName: delay.user.firstName,
    },
    vomitsAmount: delay.vomits.length,
    formattedDate: formatDelayDate(delay.createdAt),
    hasUserVomited: delay.vomits.some((vomit) => vomit.userId === userId),
  };

  return json({ delay: formattedDelay, isOwner: delay.user.id === userId });
};

export default function AtrasoIndexRoute() {
  const { delay, isOwner } = useLoaderData<typeof loader>();

  return (
    <>
      <DelayCard delay={delay} />
      {isOwner && (
        <div className="flex gap-4">
          <Button as={Link} to="./edit" type="submit" className="flex gap-1">
            <span>Editar</span>
            <div>
              <Edit2Icon size={20} />
            </div>
          </Button>
          <Form method="post" action="./delete">
            <Button
              name="intent"
              type="submit"
              value="delete"
              variant="secondary"
              className="flex gap-1"
            >
              <span>Deletar</span>
              <div>
                <Trash2Icon size={20} />
              </div>
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}
