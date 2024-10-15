const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.findUnique({
      where: { id: +id },
    });
    if (!track) {
      return res
        .status(404)
        .json({ message: "Please choose a track that exists." });
    }
    res.json(track);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
