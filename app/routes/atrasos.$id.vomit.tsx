import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getDelayById } from "~/models/delay.server";
import { addVomit, removeVomit } from "~/models/vomit.server";

import { requireUserId } from "~/session.server";

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.id, "O ID da denúnica não foi encontrado");
  const userId = await requireUserId(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (
    typeof intent !== "string" ||
    !(intent === "add" || intent === "remove")
  ) {
    throw new Response("O formulário não foi enviado corretamente.", {
      status: 400,
    });
  }

  const delay = await getDelayById(params.id);
  if (!delay) {
    throw new Response("Não encontramos uma denúncia com esse ID.", {
      status: 404,
    });
  }

  if (intent === "add") {
    if (delay.vomits.some((vomit) => vomit.userId === userId)) {
      return json({ delay });
    }

    const vomit = await addVomit({ delayId: delay.id, userId });
    if (!vomit) {
      throw new Response(
        "Ocorreu um erro interno e não conseguimos adicionar a sua reação.",
        {
          status: 500,
        },
      );
    }
    return json({ delay });
  }

  if (intent === "remove") {
    const vomit = await removeVomit({ delayId: delay.id, userId });
    if (!vomit) {
      throw new Response(
        "Ocorreu um erro interno e não conseguimos remover a sua reação.",
        {
          status: 500,
        },
      );
    }
    return json({ delay });
  }

  return json({});
};

export const loader = ({ params }: LoaderArgs) => {
  invariant(params.id, "O ID da denúnica não foi encontrado");
  return redirect(`/atrasos/${params.id}`);
};

export default function VomitRoute() {}
