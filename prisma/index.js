const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(email, password) {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: { email, password: hashPassword },
        });
        return newUser;
      },
      async Login(email, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { email: email },
        });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw Error("Invalid password");
        } else {
          return user;
        }
      },
    },
  },
});

module.exports = prisma;
