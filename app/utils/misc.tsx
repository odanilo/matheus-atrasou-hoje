import type { Delay } from "@prisma/client";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDelayDate(date: Delay["createdAt"]) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}
