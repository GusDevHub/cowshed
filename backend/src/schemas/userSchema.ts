import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: "User name has to have minimum 2 characters" }),
    email: z.email({ message: "Email must be a valid format" }),
    password: z
      .string({ message: "Password must be provided" })
      .min(6, { message: "Password needs to be at least 6 characters" }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "Email must be a valid format" }),
    password: z
      .string({ message: "Password must be provided!" })
      .min(1, { message: "Password must be provided!" }),
  }),
});
