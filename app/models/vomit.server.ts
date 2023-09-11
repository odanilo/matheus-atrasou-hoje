import type { Delay, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function addVomit({
  delayId,
  userId,
}: {
  delayId: Delay["id"];
  userId: User["id"];
}) {
  return prisma.vomit.create({
    data: {
      user: { connect: { id: userId } },
      delay: { connect: { id: delayId } },
    },
  });
}

export function removeVomit({
  delayId,
  userId,
}: {
  delayId: Delay["id"];
  userId: User["id"];
}) {
  return prisma.vomit.deleteMany({
    where: {
      userId,
      delayId,
    },
  });
}
