import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteDelayById, getDelayById } from "~/models/delay.server";

import { requireUserId } from "~/session.server";
import { badRequest } from "~/utils/request.server";

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.id, "O ID da denúnica não foi encontrado");
  const userId = await requireUserId(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (typeof intent !== "string" || !(intent === "delete")) {
    return badRequest("O formulário não foi enviado corretamente.");
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

  const deletedDelay = await deleteDelayById({ id: params.id, userId });
  if (!deletedDelay) {
    throw new Response(
      "Ocorreu um erro interno que impediu que sua denúncia fosse deletada.",
      {
        status: 500,
      },
    );
  }

  return redirect("/");
};

export const loader = async () => redirect("/");
