import z from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "Table number is required!" })
      .int({ message: "Table number must be integer" })
      .positive({ message: "Table number must be a positive number" }),
    name: z.string().optional(),
  }),
});

export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "Order must be a string" })
      .min(1, "order_id is required!"),
    product_id: z
      .string({ message: "Product must be a string" })
      .min(1, "product_id is required!"),
    amount: z
      .number()
      .int("Quantity must be a interger number")
      .positive("Quantity must be a positive number"),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: "item_id must be a string" })
      .min(1, "item_id is required!"),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "order_id must be a string" })
      .min(1, "order_id is required!"),
  }),
});

export const sendOrderSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "order_id must be a string" })
      .min(1, "order_id is required!"),
    name: z.string({ message: "Name must be a string" }),
  }),
});

export const finishOrderSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "order_id must be a string" })
      .min(1, "order_id is required!"),
  }),
});

export const deleteOrderSchema = z.object({
  query: z.object({
    order_id: z.string({ message: "order_id is mandatory!" }),
  }),
});
