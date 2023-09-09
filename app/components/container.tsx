import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "~/utils/misc";

export function Container({
  isFullWidth = false,
  className,
  children,
  ...props
}: { isFullWidth?: boolean } & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>) {
  const classes = cn(
    "max-w-7xl mx-auto px-6",
    { "max-w-full": isFullWidth },
    className,
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

<Container>teste</Container>;
