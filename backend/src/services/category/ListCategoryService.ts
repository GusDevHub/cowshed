import prismaClient from "../../prisma/index";

class ListCategoryService {
  async execute() {
    try {
      const categories = await prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return categories;
    } catch (err) {
      throw new Error("Fail while searching for categories");
    }
  }
}

export { ListCategoryService };
