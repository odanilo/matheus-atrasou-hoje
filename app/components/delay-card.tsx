import type { Delay, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { VomitIcon } from "./icons";
import type { LiHTMLAttributes } from "react";
import { cn } from "~/utils/misc";
import { useOptionalUser } from "~/utils";

export type DelayCardProps = Pick<Delay, "id" | "body" | "title"> & {
  formattedDate: string;
  user: Pick<User, "firstName">;
  vomitsAmount: number;
  hasUserVomited: boolean;
};

export function DelayCard({
  delay,
  ...props
}: { delay: DelayCardProps } & LiHTMLAttributes<HTMLLIElement>) {
  const user = useOptionalUser();
  const vomitFetcher = useFetcher();
  const isVomiting = Boolean(vomitFetcher.submission);
  const hasUserVomited =
    isVomiting && user
      ? vomitFetcher.submission?.formData?.get("willUserVomit") === "true"
      : delay.hasUserVomited;
  const vomitsAmount =
    isVomiting && user
      ? hasUserVomited && user
        ? Number(vomitFetcher.submission?.formData?.get("vomitAmount")) + 1
        : Number(vomitFetcher.submission?.formData?.get("vomitAmount")) - 1
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
          <div className="flex shrink-0 rounded-full shadow items-center justify-center h-12 w-12 bg-amber-400">
            🤬
          </div>
          <div className="flex flex-col flex-1">
            <header className="text-sm text-zinc-500">
              <span className="font-semibold">{delay.user.firstName}</span>{" "}
              <span>• {delay.formattedDate}</span>
            </header>
            <h2 className="text-amber-400">{delay.title}</h2>
            <div className="mt-2 whitespace-pre-wrap">{delay.body}</div>
          </div>
        </Link>
        <footer className="flex mt-auto justify-end text-zinc-500 p-6 pt-0">
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
