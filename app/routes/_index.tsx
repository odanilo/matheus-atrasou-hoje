import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Container } from "~/components/container";
import { VomitIcon } from "~/components/icons";
import { Nav } from "~/components/nav";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <header>
        <Nav userId={user?.id} />

        <Container className="flex flex-col gap-6 text-center mt-10 md:text-left md:flex-row md:items-center lg:gap-12 lg:justify-between lg:mt-14">
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
      <main className="mt-10 lg:mt-14">
        <Container>
          <p className="text-zinc-200">
            A verdade é que <strong>provavelmente sim</strong>, ele já atrasou
            ou até mesmo não apareceu quando deu sua palavra que assim o faria.
            E o pior, tenho certeza que também já conseguiu convencer que foi a
            última vez.
          </p>
          <header className="mt-6 flex items-end gap-4 lg:mt-10">
            <h2 className="text-2xl font-semibold ">🚨 Últimas denúncias</h2>
            <Link
              to="/atrasos/novo"
              prefetch="intent"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-amber-400 hover:bg-amber-400 hover:text-zinc-900"
            >
              <Plus size={20} />
            </Link>
          </header>
          <ul className="mt-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(360px,1fr))] lg:mt-6">
            <li className="transition-transform will-change-transform hover:-translate-y-1">
              <article>
                <Link
                  to="/"
                  prefetch="intent"
                  className="flex gap-4 p-6 bg-zinc-900 rounded border border-dashed border-zinc-700"
                >
                  <div className="flex shrink-0 rounded-full shadow items-center justify-center h-12 w-12 bg-amber-400">
                    🤡
                  </div>
                  <div className="flex-1">
                    <header className="text-sm text-zinc-500">
                      <span className="font-semibold">Danilo Nunes</span>{" "}
                      <span>• 07/09/23</span>
                    </header>
                    <h2 className="text-amber-400">Atraso no Crossfit</h2>
                    <div className="mt-2">
                      Mais uma vez Matheus prometeu chegar 19h e não apareceu
                      deixando seus amigos a ver navios!
                    </div>
                    <footer className="flex mt-4 justify-end text-zinc-500">
                      <Form
                        method="post"
                        className="group hover:text-emerald-500"
                      >
                        <button
                          type="submit"
                          className="flex items-center gap-2"
                        >
                          <div className="w-10 h-10 shrink-0 p-2 rounded-full group-hover:bg-emerald-950">
                            <VomitIcon />
                          </div>
                          <div>0</div>
                        </button>
                      </Form>
                    </footer>
                  </div>
                </Link>
              </article>
            </li>
          </ul>
        </Container>
      </main>
    </>
  );
}
