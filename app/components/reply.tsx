import type { Reply, User } from "@prisma/client";
import { Form } from "@remix-run/react";
import { BadgeCheck, Frown, Trash2Icon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "~/utils/misc";

export type ReplyProps = {
  formattedDate: string;
  user: { firstName: User["firstName"] };
  isOptmistic?: boolean;
  isOwner?: boolean;
  isDefendant?: boolean;
} & Pick<Reply, "body" | "id">;

type ReplyListProps = {
  replys: ReplyProps[];
} & HTMLAttributes<HTMLUListElement>;

export function ReplyList({ replys, className, ...props }: ReplyListProps) {
  return (
    <ul {...props} className={cn("flex flex-col gap-6", className)}>
      {replys.map(({ isOwner = false, isOptmistic = false, ...reply }) => (
        <li
          key={reply.id}
          className={cn(
            "pt-6 border-t border-zinc-900 first:pt-0 first:border-0",
            { "animate-pulse": isOptmistic },
          )}
        >
          <article>
            <header className="flex items-center">
              <address className="flex gap-2 items-center not-italic text-sm text-amber-400 font-semibold">
                <span>{reply.user.firstName}</span>
                {reply.isDefendant ? (
                  <BadgeCheck className="text-cyan-400" size={16} />
                ) : null}
              </address>
              <time className="text-sm text-zinc-600 ml-2">
                • {reply.formattedDate}
              </time>
              {isOwner ? (
                <Form
                  method="post"
                  className="text-sm pl-2 ml-auto text-red-600 hover:text-red-500"
                >
                  <input type="hidden" name="replyId" value={reply.id} />
                  <button type="submit" name="intent" value="deleteReply">
                    <Trash2Icon size={16} />
                  </button>
                </Form>
              ) : null}
            </header>
            <main className="mt-2 leading-relaxed whitespace-pre-wrap">
              {reply.body}
            </main>
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
