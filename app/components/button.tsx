import { cn } from "~/utils/misc";

export const ButtonDefaultAsType = "button" as const;
export type ButtonDefaultAsType = typeof ButtonDefaultAsType;

export type ButtonOwnProps<E extends React.ElementType> = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  as?: E;
};

export type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof ButtonOwnProps<E>>;

export const Button = <E extends React.ElementType = ButtonDefaultAsType>({
  className,
  children,
  as,
  variant = "primary",
  ...props
}: ButtonProps<E>) => {
  const classes = cn(
    "font-semibold inline-flex items-center justify-center rounded px-4 py-2 ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-amber-400 text-zinc-950 hover:bg-amber-300": variant === "primary",
      "bg-transparent shadow-border shadow-amber-400 hover:bg-amber-400 hover:text-zinc-950":
        variant === "secondary",
    },
    className,
  );
  const Tag = as || ButtonDefaultAsType;
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};
