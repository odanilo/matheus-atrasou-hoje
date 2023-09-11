import { json } from "@remix-run/node";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Container } from "~/components/container";
import type { DelayCardProps } from "~/components/delay-card";
import { DelayCard } from "~/components/delay-card";
import { Footer } from "~/components/footer";
import { Logo } from "~/components/logo";
import { Nav } from "~/components/nav";
import { getDelaysListItems } from "~/models/delay.server";
import { getLongestStreak } from "~/models/streak.server";
import { getUserId } from "~/session.server";

import { useOptionalUser } from "~/utils";
import {
  convertMillisecondsToDays,
  formatDelayDate,
  formatStreakDays,
} from "~/utils/misc";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const delays = await getDelaysListItems();
  const longestStreak = await getLongestStreak();

  if (!longestStreak) {
    throw new Response(
      "Ocorreu um erro interno para encontrar nossa maior streak.",
      {
        status: 500,
      },
    );
  }

  const longestStreakDays = formatStreakDays(longestStreak.days);
  const lastDelayDate = delays[0].createdAt;
  const currentStreakDays = formatStreakDays(
    convertMillisecondsToDays(new Date().getTime() - lastDelayDate.getTime()),
  );

  const formattedDelays = delays.map<DelayCardProps>((delay) => ({
    body: delay.body,
    id: delay.id,
    title: delay.title,
    user: {
      firstName: delay.user.firstName,
    },
    vomitsAmount: delay.vomits.length,
    formattedDate: formatDelayDate(delay.createdAt),
    hasUserVomited: delay.vomits.some((vomit) => vomit.userId === userId),
  }));

  return json({
    delays: formattedDelays,
    longestStreakDays,
    currentStreakDays,
  });
};

export const meta: V2_MetaFunction = () => [
  { title: "Matheus Atrasou Hoje? — Denuncie quando nosso amigo atrasar" },
];

export default function Index() {
  const user = useOptionalUser();
  const { delays, longestStreakDays, currentStreakDays } =
    useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <Nav userId={user?.id} hasLogo={false} />

        <Container className="flex flex-col gap-6 text-center mt-10 md:text-left md:flex-row md:items-center lg:gap-12 lg:justify-between lg:mt-14">
          <div className="md:basis-1/3 md:shrink-0 md:order-1 lg:basis-[40%]">
            <h2 className="font-artistic text-5xl text-amber-400 md:text-4xl lg:text-6xl xl:text-7xl">
              Estamos há{" "}
              <span className="whitespace-nowrap">{currentStreakDays}</span> sem
              atrasos
            </h2>
            <p className="text-lg">
              Nosso recorde é de{" "}
              <span className="font-semibold shadow-underline shadow-amber-950">
                {longestStreakDays}
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
              <DelayCard key={delay.id} delay={delay} />
            ))}
          </ul>
        </Container>
      </main>
      <Footer className="mt-10 lg:mt-14" />
    </>
  );
}
