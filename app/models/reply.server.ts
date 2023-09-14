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

export function getReplyById(replyId: Reply["id"]) {
  return prisma.reply.findUnique({ where: { id: replyId } });
}

export function deleteReplyById({ id, userId }: Pick<Reply, "id" | "userId">) {
  return prisma.reply.deleteMany({ where: { id, userId } });
}
