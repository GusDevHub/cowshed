import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ message: "Category name has to be a text" }).min(2, {
      message: "Category name has to be at least 2 characaters long!",
    }),
  }),
});
