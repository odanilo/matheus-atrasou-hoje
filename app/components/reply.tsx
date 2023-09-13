import type { Reply, User } from "@prisma/client";
import { Frown } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "~/utils/misc";

export type ReplyProps = {
  formattedDate: string;
  user: { firstName: User["firstName"] };
} & Pick<Reply, "body" | "id">;

type ReplyListProps = {
  replys: ReplyProps[];
} & HTMLAttributes<HTMLUListElement>;

export function ReplyList({ replys, className, ...props }: ReplyListProps) {
  return (
    <ul {...props} className={cn("flex flex-col gap-6", className)}>
      {replys.map((reply) => (
        <li
          key={reply.id}
          className="pt-6 border-t border-zinc-900 first:pt-0 first:border-0"
        >
          <article>
            <header className="flex items-center">
              <address className="not-italic text-sm text-amber-400  font-semibold">
                {reply.user.firstName}
              </address>
              <time className="text-sm text-zinc-600 ml-2">
                {reply.formattedDate}
              </time>
            </header>
            <main className="mt-2 leading-relaxed">{reply.body}</main>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function ReplyEmptyList({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section {...props} className={cn("text-center text-zinc-500", className)}>
      <p className="flex justify-center gap-1 font-semibold text-xl text-zinc-400">
        <span>Oh nooo!</span>
        <Frown />
      </p>
      <p className="text-sm leading-relaxed mt-2">
        Ainda não há um comentário sobre essa denúncia. Provavelmente Matheus
        está elaborando sua defesa para entrar com recurso.
      </p>
    </section>
  );
}
