import type { Streak } from "@prisma/client";
import { prisma } from "~/db.server";

export function createStreak({
  days,
  startDay,
}: {
  days: Streak["days"];
  startDay: Streak["startDay"];
}) {
  return prisma.streak.create({
    data: {
      days,
      startDay,
    },
  });
}

export function getLongestStreak() {
  return prisma.streak.findMany({
    take: 1,
    select: { days: true, startDay: true, endDay: true },
    orderBy: { days: "desc" },
  });
}
