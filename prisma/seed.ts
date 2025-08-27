import { PrismaClient, Distance, RaceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding triathlon races...');

  // Clear existing races
  await prisma.raceSelection.deleteMany();
  await prisma.race.deleteMany();

  // Seed triathlon races (HALF and FULL only, no marathons)
  const races = [
    // HALF Distance (70.3) Races
    {
      name: 'Ironman 70.3 World Championship',
      location: 'Nice, France',
      date: new Date('2024-09-15'),
      distance: Distance.HALF,
      status: RaceStatus.CLOSED,
      registrationUrl: 'https://www.ironman.com/im703-nice',
      description: 'The ultimate 70.3 championship race in the beautiful French Riviera.',
    },
    {
      name: 'Ironman 70.3 California',
      location: 'Oceanside, CA',
      date: new Date('2024-04-06'),
      distance: Distance.HALF,
      status: RaceStatus.OPEN,
      registrationUrl: 'https://www.ironman.com/im703-california',
      description: 'Fast and flat course perfect for personal bests.',
    },
    {
      name: 'Ironman 70.3 Austin',
      location: 'Austin, TX',
      date: new Date('2024-10-27'),
      distance: Distance.HALF,
      status: RaceStatus.OPEN,
      registrationUrl: 'https://www.ironman.com/im703-austin',
      description: 'Rolling hills and great post-race atmosphere in music city.',
    },
    {
      name: 'Ironman 70.3 Florida',
      location: 'Haines City, FL',
      date: new Date('2024-05-18'),
      distance: Distance.HALF,
      status: RaceStatus.WAITLIST,
      registrationUrl: 'https://www.ironman.com/im703-florida',
      description: 'Fast course with great weather and enthusiastic crowds.',
    },

    // FULL Distance (140.6) Races
    {
      name: 'Ironman World Championship',
      location: 'Kailua-Kona, HI',
      date: new Date('2024-10-12'),
      distance: Distance.FULL,
      status: RaceStatus.CLOSED,
      registrationUrl: 'https://www.ironman.com/world-championship',
      description: 'The most prestigious triathlon race in the world.',
    },
    {
      name: 'Ironman Arizona',
      location: 'Tempe, AZ',
      date: new Date('2024-11-24'),
      distance: Distance.FULL,
      status: RaceStatus.OPEN,
      registrationUrl: 'https://www.ironman.com/im-arizona',
      description: 'Fast, flat course ideal for first-time Ironman athletes.',
    },
    {
      name: 'Ironman Florida',
      location: 'Panama City Beach, FL',
      date: new Date('2024-11-02'),
      distance: Distance.FULL,
      status: RaceStatus.OPEN,
      registrationUrl: 'https://www.ironman.com/im-florida',
      description: 'Flat and fast course with beautiful beach finish.',
    },
    {
      name: 'Ironman Lake Placid',
      location: 'Lake Placid, NY',
      date: new Date('2024-07-28'),
      distance: Distance.FULL,
      status: RaceStatus.WAITLIST,
      registrationUrl: 'https://www.ironman.com/im-lake-placid',
      description: 'Challenging but scenic course in the Adirondack Mountains.',
    },
  ];

  for (const race of races) {
    await prisma.race.create({
      data: race,
    });
  }

  console.log(`Seeded ${races.length} triathlon races successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });