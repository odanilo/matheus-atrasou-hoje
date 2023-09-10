import type { Delay, User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { VomitIcon } from "./icons";
import type { LiHTMLAttributes } from "react";
import { cn } from "~/utils/misc";

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
  const vomitActionClasses = cn("group hover:text-emerald-500", {
    "text-emerald-500 hover:text-emerald-400": delay.hasUserVomited,
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
            <div className="mt-2">{delay.body}</div>
          </div>
        </Link>
        <footer className="flex mt-auto justify-end text-zinc-500 p-6 pt-0">
          <Form
            action={`/atrasos/${delay.id}/vomit`}
            method="post"
            className={vomitActionClasses}
          >
            <button
              name="intent"
              type="submit"
              value={delay.hasUserVomited ? "remove" : "add"}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 shrink-0 p-2 rounded-full group-hover:bg-emerald-950">
                <VomitIcon />
              </div>
              <div>{delay.vomitsAmount}</div>
            </button>
          </Form>
        </footer>
      </article>
    </li>
  );
}
