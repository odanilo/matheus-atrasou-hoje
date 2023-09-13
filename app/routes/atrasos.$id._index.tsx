import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { Edit2Icon, MessageCircle, Trash2Icon } from "lucide-react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import type { DelayCardProps } from "~/components/delay-card";
import { DelayCard } from "~/components/delay-card";
import type { ReplyProps } from "~/components/reply";
import { ReplyEmptyList, ReplyList } from "~/components/reply";
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
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const actionData = useActionData();
  const replys: ReplyProps[] = [
    {
      id: "1#",
      user: { firstName: "Michael Gough" },
      body: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.",
      formattedDate: new Date().toLocaleString("PT-BR"),
    },
    {
      id: "2#",
      user: { firstName: "Jese Leos" },
      body: "Much appreciated! Glad you liked it ☺️",
      formattedDate: new Date().toLocaleString("PT-BR"),
    },
  ];

  useEffect(() => {
    if (actionData?.fieldErrors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <DelayCard delay={delay} />
      {isOwner && (
        <div className="flex gap-4 mt-4">
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
      <section className="mt-10 pt-8 border-t border-zinc-900/75 lg:mt-12 lg:pt-10">
        <header>
          <h2 className="text-2xl font-semibold">
            Discussão ({replys.length})
          </h2>
          <Form method="post" className="mt-4">
            <fieldset>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-300 sr-only"
              >
                Adicione um comentário
              </label>
              <div>
                <textarea
                  ref={bodyRef}
                  id="body"
                  required
                  autoFocus={true}
                  rows={5}
                  defaultValue={actionData?.fields?.body}
                  name="body"
                  autoComplete="body"
                  aria-invalid={
                    actionData?.fieldErrors?.body ? true : undefined
                  }
                  aria-describedby="body-error"
                  placeholder="Escreva um comentário..."
                  className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-lg placeholder:text-zinc-600 aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {actionData?.fieldErrors?.body ? (
                  <div
                    className="pt-1 text-red-600 mt-1 text-sm"
                    id="body-error"
                  >
                    {actionData.fieldErrors.body}
                  </div>
                ) : null}
              </div>
            </fieldset>
            <Button type="submit" className="gap-1 mt-2">
              <span>Adicionar comentário</span>
              <MessageCircle />
            </Button>
          </Form>

          {replys.length > 0 ? (
            <ReplyList replys={replys} className="mt-10" />
          ) : (
            <ReplyEmptyList className="mt-12" />
          )}
        </header>
      </section>
    </>
  );
}
