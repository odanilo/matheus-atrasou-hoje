import type { ActionArgs, LoaderArgs, V2_MetaArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
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
import { createReply } from "~/models/reply.server";
import { getUserId, requireUserId } from "~/session.server";
import { validateBodyField } from "~/utils/input-validation";
import { formatDelayDate } from "~/utils/misc";
import { badRequest } from "~/utils/request.server";

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.id, "O ID da denúnica não foi encontrado");
  const form = await request.formData();
  const body = form.get("body");
  if (typeof body !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "O formulário não foi enviado corretamente",
    });
  }
  const fields = { body };
  const fieldErrors = {
    body: validateBodyField(body),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
      formError: null,
    });
  }
  const newReply = await createReply({ body, delayId: params.id, userId });
  if (!newReply) {
    const errorMessage =
      "Ocorreu um erro interno no momento da criação da sua resposta, por favor tente novamente.";
    return json(
      {
        fields,
        fieldErrors,
        formError: errorMessage,
      },
      {
        status: 500,
        statusText: errorMessage,
      },
    );
  }

  return json({ fields: { body: "" }, fieldErrors: null, formError: null });
};

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

  const replys: ReplyProps[] = delay.reply.map((reply) => {
    return {
      body: reply.body,
      formattedDate: formatDelayDate(reply.createdAt),
      id: reply.id,
      user: {
        firstName: reply.user.firstName,
      },
    };
  });

  return json({
    delay: formattedDelay,
    isOwner: delay.user.id === userId,
    replys,
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }: V2_MetaArgs) => [
  { title: `${data.delay.title} | Denúncia | Matheus Atrasou Hoje?` },
];

export default function AtrasoIndexRoute() {
  const actionData = useActionData<typeof action>();
  const { delay, isOwner, replys } = useLoaderData<typeof loader>();
  const formReplyRef = useRef<HTMLFormElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    formReplyRef.current?.reset();
    bodyRef.current?.focus();
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
          <Form ref={formReplyRef} method="post" className="mt-4">
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
