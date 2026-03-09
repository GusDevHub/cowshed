import prismaClient from "../../prisma/index";

interface DeleteOrderProps {
  order_id: string;
}
class DeleteOrderService {
  async execute({ order_id }: DeleteOrderProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: {
          id: order_id,
        },
      });
      if (!order) {
        throw new Error("Fail while deleting order");
      }
      await prismaClient.order.delete({
        where: {
          id: order_id,
        },
      });
      return { message: "Order successfully deleted!" };
    } catch (err) {
      console.log(err);
      throw new Error("Fail while deleting order");
    }
  }
}

export { DeleteOrderService };
