import { json } from "@remix-run/node";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Container } from "~/components/container";
import { VomitIcon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { Nav } from "~/components/nav";
import { getDelaysListItems } from "~/models/delay.server";
import { getUserId } from "~/session.server";

import { useOptionalUser } from "~/utils";
import { formatDelayDate } from "~/utils/misc";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const delays = await getDelaysListItems();
  const formattedDelays = delays.map((delay) => ({
    ...delay,
    createdAt: formatDelayDate(delay.createdAt),
    hasVomited: delay.vomits.some((vomit) => vomit.userId === userId),
  }));

  return json({ delays: formattedDelays });
};

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const { delays } = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <Nav userId={user?.id} hasLogo={false} />

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
            <Logo />
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
          <header className="mt-6 flex items-center gap-4 lg:mt-10">
            <h2 className="text-2xl font-semibold">🚨 Últimas denúncias</h2>
            <Link
              to="/atrasos/novo"
              prefetch="intent"
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-zinc-800 text-amber-400 hover:bg-amber-400 hover:text-zinc-900"
            >
              <Plus size={20} />
            </Link>
          </header>
          <ul className="mt-4 grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] lg:mt-6">
            {delays.map((delay) => (
              <li
                key={delay.id}
                className="flex flex-col transition-transform will-change-transform hover:-translate-y-1"
              >
                <article className="flex flex-1 flex-col">
                  <Link
                    to="/"
                    prefetch="intent"
                    className="flex flex-1 gap-4 p-6 bg-zinc-900 rounded border border-dashed border-zinc-700"
                  >
                    <div className="flex shrink-0 rounded-full shadow items-center justify-center h-12 w-12 bg-amber-400">
                      🤡
                    </div>
                    <div className="flex flex-col flex-1">
                      <header className="text-sm text-zinc-500">
                        <span className="font-semibold">
                          {delay.user.firstName}
                        </span>{" "}
                        <span>• {delay.createdAt}</span>
                      </header>
                      <h2 className="text-amber-400">{delay.title}</h2>
                      <div className="mt-2">{delay.body}</div>
                      <footer className="flex mt-auto pt-4 justify-end text-zinc-500">
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
                            <div>{delay.vomits.length}</div>
                          </button>
                        </Form>
                      </footer>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </>
  );
}
