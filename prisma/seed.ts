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
      title: "Atraso pra nosso compromisso",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempor elementum ultrices. Morbi tincidunt sed quam ut ornare. Vestibulum ultrices eros at dolor tempor ullamcorper. Aenean pharetra justo sit amet nisl vestibulum, id rhoncus lacus tincidunt. Mauris nec turpis duis.",
      createAt: new Date("2023-09-01"),
    },
    {
      title: "Não veio pra formatura",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac tortor quam. Proin quis elit id nibh blandit facilisis. Maecenas vel ut.",
      createAt: new Date("2023-09-02"),
    },
    {
      title: "Esqueceu de aparecer no bar",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod in ex non ullamcorper. Ut lobortis justo neque, nec iaculis ipsum convallis id. Nam iaculis libero eget tortor consectetur, eu commodo dui molestie. Etiam id dolor ullamcorper, condimentum dolor nec, tempor erat. Fusce pellentesque porttitor duis.",
      createAt: new Date("2023-09-10"),
    },
    {
      title: "Deixou de ir pro meu aniversário",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate erat id quam accumsan pellentesque. Maecenas placerat neque ut elementum dignissim. Aliquam bibendum orci eget vestibulum.",
      createAt: new Date("2023-09-15"),
    },
  ];

  const delays = await Promise.all(
    fakeDelays.map((data) =>
      prisma.delay.create({
        data: {
          body: data.body,
          title: data.title,
          userId: user.id,
          createdAt: data.createAt,
        },
      }),
    ),
  );

  await Promise.all(
    fakeDelays.map((data, index, array) => {
      const prevDelayIndex = index - 1 < 0 ? 0 : index - 1;
      const prevDelayDate = array[prevDelayIndex].createAt || new Date();
      const currentDelayDate = data.createAt;
      const days = Math.floor(
        (currentDelayDate.getTime() - prevDelayDate.getTime()) / 86400000,
      );

      return prisma.streak.create({
        data: {
          days,
          startDay: prevDelayDate,
        },
      });
    }),
  );

  await prisma.vomit.create({
    data: { delayId: delays[3].id, userId: user.id },
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
