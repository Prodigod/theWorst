const prisma = require("../prisma");

const seed = async (numUsers = 5, numPlaylists = 10) => {
  const users = Array.from({ length: numUsers }, (_, i) => ({
    username: `User ${i + 1}`,
  }));

  await prisma.user.createMany({ data: users });

  const playlists = Array.from({ length: numPlaylists }, (_, i) => ({
    name: `Playlist ${i + 1}`,
    description: `Playlist ${i + 1}@SuperCoolDescription`,
    ownerId: 1 + Math.floor(Math.random() * numUsers),
  }));

  await prisma.playlist.createMany({ data: playlists });

  const numberOfTracks = 20;
  for (let i = 0; i < numberOfTracks; i++) {
    const trackSize = 1 + Math.floor(Math.random() * 8);
    const track = Array.from({ length: trackSize }, () => ({
      id: 1 + Math.floor(Math.random() * numPlaylists),
    }));

    await prisma.track.create({
      data: {
        name: `Track ${i + 1}`,
        playlists: { connect: track },
      },
    });
  }
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
