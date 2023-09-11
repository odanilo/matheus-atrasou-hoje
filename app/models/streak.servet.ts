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
  return prisma.streak.findFirst({ orderBy: { days: "desc" } });
}
