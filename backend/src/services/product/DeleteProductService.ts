import prismaClient from "../../prisma/index";

interface DeleteProductServiceProps {
  product_id: string;
}

class DeleteProductService {
  async execute({ product_id }: DeleteProductServiceProps) {
    try {
      await prismaClient.product.update({
        where: {
          id: product_id,
        },
        data: {
          disabled: true,
        },
      });

      return { message: "Product successfully deleted!" };
    } catch (err) {
      console.log(err);
      throw new Error("Fail while deleting product...");
    }
  }
}
export { DeleteProductService };
