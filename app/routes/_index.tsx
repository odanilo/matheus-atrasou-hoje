import type { V2_MetaFunction } from "@remix-run/node";
import { Container } from "~/components/container";
import { Nav } from "~/components/nav";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <header>
        <Nav userId={user?.id} />

        <Container className="flex flex-col gap-6 text-center mt-10 md:text-left md:flex-row md:items-center lg:gap-12 lg:justify-between">
          <div className="md:basis-1/3 md:shrink-0 md:order-1 lg:basis-[40%]">
            <h2 className="font-artistic text-5xl text-amber-400 md:text-4xl lg:text-6xl xl:text-7xl">
              Estamos há <span className="whitespace-nowrap">30 dias</span> sem
              atrasos
            </h2>
            <p className="text-lg">
              Nosso recorde é de{" "}
              <span className="font-semibold shadow-underline shadow-amber-950">
                30 dias
              </span>{" "}
              🙄
            </p>
          </div>
          <div className="md:flex-1">
            <img src="./logo-matheus-atrasou.png" alt="Logo Matheus Atrasou" />
          </div>
        </Container>
      </header>
    </>
  );
}
