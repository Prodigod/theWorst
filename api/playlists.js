const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: {
        tracks: true,
      },
    });
    if (!playlist) {
      return res.status(404).json({ message: "That playlist doesnt exist." });
    }
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

router.post("/:id", async (req, res, next) => {
  const { name, description, ownerId, tracks } = req.body;

  
  if (!name || !description || !ownerId) {
    return next({
      status: 400,
      message:
        "Playlist name, description, and ownerId must be provided for a new playlist.",
    });
  }

  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId,
        tracks: {
          connect: tracks?.map((track) => ({ id: track.id })), // Connecting tracks if provided
        },
      },
    });

    res.status(201).json({
      status: 201,
      message: "Playlist created successfully.",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
