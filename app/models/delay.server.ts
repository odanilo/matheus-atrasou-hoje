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
      reply: { select: { user: { select: { firstName: true } } } },
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

export function getDelayById(id: Delay["id"]) {
  return prisma.delay.findFirst({
    select: {
      body: true,
      createdAt: true,
      id: true,
      title: true,
      user: true,
      vomits: {
        select: {
          id: true,
          userId: true,
        },
      },
      reply: {
        select: {
          body: true,
          createdAt: true,
          id: true,
          user: { select: { id: true, firstName: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: { id },
  });
}

export function deleteDelayById({
  id,
  userId,
}: {
  id: Delay["id"];
  userId: User["id"];
}) {
  return prisma.delay.deleteMany({ where: { id, user: { id: userId } } });
}

export function updateDelay({
  id,
  title,
  body,
}: Pick<Delay, "id" | "title" | "body">) {
  return prisma.delay.update({
    where: { id },
    data: { title, body },
  });
}

export function getLastDelay() {
  return prisma.delay.findFirst({ orderBy: { createdAt: "desc" } });
}
