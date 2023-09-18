import type { Delay, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { VomitIcon } from "./icons";
import type { LiHTMLAttributes } from "react";
import { cn } from "~/utils/misc";
import { useOptionalUser } from "~/utils";
import { BadgeCheck } from "lucide-react";

export type DelayCardProps = Pick<Delay, "id" | "body" | "title"> & {
  formattedDate: string;
  user: Pick<User, "firstName">;
  vomitsAmount: number;
  hasUserVomited: boolean;
  isDefendant?: boolean;
  hasContestation?: boolean;
};

export function DelayCard({
  delay,
  ...props
}: { delay: DelayCardProps } & LiHTMLAttributes<HTMLLIElement>) {
  const user = useOptionalUser();
  const vomitFetcher = useFetcher();
  const isActionReload =
    vomitFetcher.state === "loading" &&
    vomitFetcher.formMethod != null &&
    vomitFetcher.data != null;
  const isVomiting = Boolean(
    vomitFetcher.state === "submitting" || isActionReload,
  );
  const hasUserVomited =
    isVomiting && user
      ? vomitFetcher.formData?.get("willUserVomit") === "true"
      : delay.hasUserVomited;
  const vomitsAmount =
    isVomiting && user
      ? hasUserVomited && user
        ? Number(vomitFetcher.formData?.get("vomitAmount")) + 1
        : Number(vomitFetcher.formData?.get("vomitAmount")) - 1
      : delay.vomitsAmount;
  const vomitActionClasses = cn("group hover:text-emerald-500", {
    "text-emerald-500 hover:text-emerald-400": hasUserVomited,
  });

  return (
    <li
      className="flex flex-col transition-transform will-change-transform hover:-translate-y-1"
      {...props}
    >
      <article className="flex flex-1 flex-col relative bg-zinc-900 rounded border border-dashed border-zinc-700">
        <Link
          to={`/atrasos/${delay.id}`}
          prefetch="intent"
          className="flex flex-1 gap-4 p-6"
        >
          <div className="flex shrink-0 rounded-full shadow items-center justify-center h-12 w-12 bg-zinc-800">
            🤬
          </div>
          <div className="flex flex-col flex-1">
            <header className="text-sm text-zinc-500">
              <span className="font-semibold text-amber-400 inline-flex items-center gap-1.5">
                {delay.user.firstName}{" "}
                {delay.isDefendant ? (
                  <BadgeCheck className="text-cyan-400" size={16} />
                ) : null}
              </span>{" "}
              <span>• {delay.formattedDate}</span>
            </header>
            <h2 className="mt-1.5 leading-tight font-semibold">
              {delay.title}
            </h2>
            <div className="mt-2 whitespace-pre-wrap text-zinc-200">
              {delay.body}
            </div>
          </div>
        </Link>
        <footer className="flex mt-auto justify-end text-zinc-500 p-6 pt-0">
          {delay.hasContestation ? (
            <div className="self-center mr-auto text-xs font-medium px-2.5 py-0.5 rounded bg-red-400/40 text-zinc-50">
              Contestada
            </div>
          ) : null}
          <vomitFetcher.Form
            action={`/atrasos/${delay.id}/vomit`}
            method="post"
            className={vomitActionClasses}
          >
            <input
              type="hidden"
              name="willUserVomit"
              value={(!hasUserVomited).toString()}
            />
            <input type="hidden" name="vomitAmount" value={vomitsAmount} />
            <button
              name="intent"
              type="submit"
              value={hasUserVomited ? "remove" : "add"}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 shrink-0 p-2 rounded-full group-hover:bg-emerald-950">
                <VomitIcon />
              </div>
              <div>{vomitsAmount}</div>
            </button>
          </vomitFetcher.Form>
        </footer>
      </article>
    </li>
  );
}
