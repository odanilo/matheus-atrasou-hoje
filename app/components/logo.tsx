import type { ImgHTMLAttributes } from "react";

export function Logo({ ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="./logo-matheus-atrasou.png"
      alt="Logo Matheus Atrasou"
      {...props}
    />
  );
}
