import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Spinner } from "~/components/spinner";
import { getDelayById, updateDelay } from "~/models/delay.server";
import { requireUserId } from "~/session.server";
import {
  validateBodyField,
  validateTitleField,
} from "~/utils/input-validation";
import { badRequest } from "~/utils/request.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request);
  invariant(params.id, "O ID da denúnica não foi encontrado");

  const delay = await getDelayById(params.id);
  if (!delay) {
    throw new Response("Não encontramos uma denúncia com esse ID.", {
      status: 404,
    });
  }

  return json({ fields: { title: delay.title, body: delay.body } });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.id, "O ID da denúnica não foi encontrado");
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

  const delay = await getDelayById(params.id);
  if (!delay) {
    throw new Response("Não encontramos uma denúncia com esse ID.", {
      status: 404,
    });
  }

  if (delay.user.id !== userId) {
    throw new Response("Você não tem permissão para executar essa ação.", {
      status: 405,
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

  const newDelay = await updateDelay({ id: delay.id, body, title });
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

  return redirect(`/atrasos/${newDelay.id}`);
};

export default function EditDelayRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const navigation = useNavigation();
  const isUpdating = Boolean(navigation.state === "submitting");

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
              defaultValue={
                actionData?.fields?.title || loaderData.fields.title
              }
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
              defaultValue={actionData?.fields?.body || loaderData.fields.body}
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
          <Button type="submit" disabled={isUpdating} className="w-full">
            <div className="relative flex gap-2">
              <span>{isUpdating ? "Atualizando" : "Atualizar"}</span>
              <Spinner showSpinner={isUpdating} />
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
