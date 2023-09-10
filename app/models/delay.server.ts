import type { Delay, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getDelaysListItems() {
  return prisma.delay.findMany({
    select: {
      id: true,
      body: true,
      title: true,
      createdAt: true,
      user: {
        select: { firstName: true, id: true },
      },
      vomits: { select: { id: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createDelay({
  body,
  title,
  userId,
}: {
  title: Delay["title"];
  body: Delay["body"];
  userId: User["id"];
}) {
  return prisma.delay.create({
    data: { body, title, user: { connect: { id: userId } } },
  });
}
