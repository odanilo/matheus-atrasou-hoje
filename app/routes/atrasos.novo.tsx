import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Spinner } from "~/components/spinner";
import { createDelay } from "~/models/delay.server";
import { createStreak } from "~/models/streak.server";
import { requireUserId } from "~/session.server";
import {
  validateBodyField,
  validateTitleField,
} from "~/utils/input-validation";
import { convertMillisecondsToDays } from "~/utils/misc";
import { badRequest } from "~/utils/request.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  if (typeof title !== "string" || typeof body !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "O formulário não foi enviado corretamente",
    });
  }

  const fields = { title, body };
  const fieldErrors = {
    title: validateTitleField(title),
    body: validateBodyField(body),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
      formError: null,
    });
  }

  const newDelay = await createDelay({ body, title, userId });
  if (!newDelay) {
    const errorMessage =
      "Ocorreu um erro interno no momento da criação da sua denúncia, por favor tente novamente.";
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

  const currentStreakDays = convertMillisecondsToDays(
    new Date().getTime() - newDelay.createdAt.getTime(),
  );
  const streak = await createStreak({
    days: currentStreakDays,
    startDay: newDelay.createdAt,
  });
  if (!streak) {
    throw new Response("Ocorreu um erro interno para criar uma streak.", {
      status: 500,
    });
  }

  return redirect(`/atrasos/${newDelay.id}`);
};

export const meta: V2_MetaFunction = () => [
  { title: "Criar Denúncia | Matheus Atrasou Hoje?" },
];

export default function CreateDelayRoute() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");

  useEffect(() => {
    if (actionData?.fieldErrors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.fieldErrors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Container className="space-y-4 max-w-xl">
      <header>
        <h2 className="text-2xl font-semibold">Criar denúncia</h2>
        <p className="text-zinc-200">
          Lembre-se: é importante ser bastante descritivo para que Matheus não
          consiga distorcer os fatos em seu favor!
        </p>
      </header>

      <Form
        method="post"
        className="space-y-6 mt-8 bg-zinc-900 shadow-lg border border-zinc-950 rounded-lg p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Título
          </label>
          <div className="mt-1">
            <input
              ref={titleRef}
              id="title"
              required
              autoFocus={true}
              defaultValue={actionData?.fields?.title}
              name="title"
              type="text"
              autoComplete="title"
              aria-invalid={actionData?.fieldErrors?.title ? true : undefined}
              aria-describedby="title-error"
              placeholder="Marcou e apareceu só no outro dia"
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-lg placeholder:text-zinc-500 aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {actionData?.fieldErrors?.title ? (
              <div className="pt-1 text-red-600 mt-1 text-sm" id="title-error">
                {actionData.fieldErrors.title}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-300"
          >
            Detalhes
          </label>
          <div className="mt-1">
            <textarea
              ref={bodyRef}
              id="body"
              required
              rows={5}
              defaultValue={actionData?.fields?.body}
              name="body"
              autoComplete="body"
              aria-invalid={actionData?.fieldErrors?.body ? true : undefined}
              aria-describedby="body-error"
              placeholder="Tinha combinado com ele de ir no churrasquinho que não tem toldo e ele nunca mais me respondeu no whatsapp"
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-lg placeholder:text-zinc-500 aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {actionData?.fieldErrors?.body ? (
              <div className="pt-1 text-red-600 mt-1 text-sm" id="body-error">
                {actionData.fieldErrors.body}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <Button type="submit" disabled={isCreating} className="w-full">
            <div className="relative flex gap-2">
              <span>{isCreating ? "Denunciando" : "Denunciar"}</span>
              <Spinner showSpinner={isCreating} />
            </div>
          </Button>
          {actionData?.formError ? (
            <div className="pt-1 text-red-600 mt-1 text-sm" id="password-error">
              {actionData.formError}
            </div>
          ) : null}
        </div>
      </Form>
    </Container>
  );
}
