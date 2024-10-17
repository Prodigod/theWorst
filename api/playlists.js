const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { authenticate } = require("./auth");
router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true },
    });
    if (playlist.ownerId !== req.user.id) {
      next({ status: 403, message: "You do not own this playlist." });
    }
    res.json(playlist);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
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
