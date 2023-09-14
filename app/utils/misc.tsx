import type { Delay, Streak } from "@prisma/client";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDelayDate(date: Delay["createdAt"]) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function convertMillisecondsToDays(milliseconds: number) {
  return Math.floor(milliseconds / 86400000);
}

export function convertDaysToMilliseconds(days: number) {
  return Math.floor(days * 86400000);
}

export function formatStreakDays(days: Streak["days"]) {
  const formattedDays = days < 10 && days > 0 ? `0${days}` : days;
  const inflection = days === 1 ? "dia" : "dias";
  return `${formattedDays} ${inflection}`;
}

export function formatMillisecondsToStreakDays(milliseconds: number) {
  return formatStreakDays(convertMillisecondsToDays(milliseconds));
}
