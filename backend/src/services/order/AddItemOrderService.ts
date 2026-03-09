import prismaClient from "../../prisma/index";

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ order_id, product_id, amount }: ItemProps) {
    try {
      const orderExists = await prismaClient.order.findFirst({
        where: {
          id: order_id,
        },
      });
      if (!orderExists) {
        throw new Error("Order not found!");
      }

      const productExists = await prismaClient.product.findFirst({
        where: {
          id: product_id,
          disabled: false,
        },
      });
      if (!productExists) {
        throw new Error("Product not found!");
      }

      const item = await prismaClient.item.create({
        data: {
          order_id: order_id,
          product_id: product_id,
          amount: amount,
        },
        select: {
          id: true,
          order_id: true,
          amount: true,
          createdAt: true,
          product_id: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              banner: true,
            },
          },
        },
      });
      return item;
    } catch (err) {
      console.log(err);
      throw new Error("Fail while adding item to order");
    }
  }
}

export { AddItemOrderService };
