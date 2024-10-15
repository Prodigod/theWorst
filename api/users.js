const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        playlists: true,
      },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: {
        playlists: true,
      },
    });
    if (!user) {
     return res.status(404).json({ message: "Please choose a user that exists." });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
