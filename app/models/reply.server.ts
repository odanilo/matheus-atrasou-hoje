import type { Reply } from "@prisma/client";
import { prisma } from "~/db.server";

export function createReply({
  body,
  delayId,
  userId,
}: Pick<Reply, "body" | "delayId" | "userId">) {
  return prisma.reply.create({
    data: {
      body,
      delay: { connect: { id: delayId } },
      user: { connect: { id: userId } },
    },
  });
}
