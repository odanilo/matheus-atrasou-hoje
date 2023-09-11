import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const firstName = "Rachel";
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const fakeDelays = [
    {
      title: "Atraso no Crossfit",
      body: "Mais uma vez Matheus prometeu chegar 19h e não apareceu deixando seus amigos a ver navios!",
    },
    {
      title: "Não veio pra formatura",
      body: "Fat Tony is a cancer on this fair city! He is the cancer and I am the…uh…what cures cancer? Slow down, Bart! My legs don't know how to be as long as yours. What good is money if it can't inspire terror in your fellow man?",
    },
    {
      title: "Esqueceu de aparecer no bar",
      body: "Bart, with $10,000 we'd be millionaires! We could buy all kinds of useful things like…love! I hope this has taught you kids a lesson: kids never learn. You know, the one with all the well meaning rules that don't work out in real life, uh, Christianity.",
    },
    {
      title: "Deixou de ir pro meu aniversário",
      body: "A woman is a lot like a refrigerator. Six feet tall, 300 pounds…it makes ice. A woman is a lot like a refrigerator. Six feet tall, 300 pounds…it makes ice. How could you?! Haven't you learned anything from that guy who gives those sermons at church? Captain Whatshisname? We live in a society of laws! Why do you think I took you to all those Police Academy movies? For fun? Well, I didn't hear anybody laughing, did you? Except at that guy who made sound effects. Makes sound effects and laughs. Where was I? Oh yeah! Stay out of my booze.",
    },
  ];

  const delays = await Promise.all(
    fakeDelays.map((data) =>
      prisma.delay.create({
        data: {
          body: data.body,
          title: data.title,
          userId: user.id,
        },
      }),
    ),
  );

  await prisma.vomit.create({
    data: { delayId: delays[1].id, userId: user.id },
  });

  await prisma.streak.create({
    data: {
      days: 10,
      startDay: new Date("08/09/2023"),
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
