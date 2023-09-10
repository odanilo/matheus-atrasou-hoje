import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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

  if (delay.user.id !== userId) {
    throw new Response("Você não tem permissão para executar essa ação.", {
      status: 405,
    });
  }

  if (intent === "add") {
    const vomit = await addVomit({ delayId: delay.id, userId });
    if (!vomit) {
      throw new Response(
        "Ocorreu um erro interno e não conseguimos adicionar a sua reação.",
        {
          status: 500,
        },
      );
    }
    return redirect("/");
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
    return redirect("/");
  }

  return redirect("/");
};

export const loader = async () => redirect("/");
