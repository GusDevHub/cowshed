import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { CreateUserController } from "./controllers/user/createUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/categorySchema";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import {
  createProductSchema,
  listProductByCategorySchema,
  ListProductSchema,
} from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/ListProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { ListProductByCategoryController } from "./controllers/product/ListProductByCategoryController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import {
  addItemSchema,
  createOrderSchema,
  deleteOrderSchema,
  detailOrderSchema,
  finishOrderSchema,
  removeItemSchema,
  sendOrderSchema,
} from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

const router = Router();
const upload = multer(uploadConfig);

// Users Routes
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);
router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);
router.get("/me", isAuthenticated, new DetailUserController().handle);

// Categories Routes
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

router.get("/category", isAuthenticated, new ListCategoryController().handle);

//Products Routes
router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

router.get(
  "/products",
  isAuthenticated,
  validateSchema(ListProductSchema),
  new ListProductController().handle,
);

router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);

router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

//Orders Routes
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);

router.get("/orders", isAuthenticated, new ListOrdersController().handle);

router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemController().handle,
);

router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemController().handle,
);

router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle,
);

router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);

router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

router.delete(
  "/order",
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);

export { router };
