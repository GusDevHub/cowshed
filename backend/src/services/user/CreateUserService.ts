import prismaClient from "../../prisma/index";
import { hash } from "bcryptjs";
interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserProps) {
    // console.log(name, email, password);

    const userAlreadyExist = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExist) {
      throw new Error("User already exist!");
    }

    const passwordHash = await hash(password, 8);

    const user = prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    return user;
  }
}

export { CreateUserService };
