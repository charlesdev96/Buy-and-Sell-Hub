import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authorizeUser, validateInputs } from "../middlewares";
import {
	createProductSchema,
	singleProductSchema,
	updateProductSchema,
} from "../schema";
import { validate } from "node-cron";

export class ProductRouter {
	private router: Router;
	private productController: ProductController;
	constructor() {
		this.router = Router();
		this.productController = new ProductController();
		this.initializeRoute();
	}

	private initializeRoute() {
		//create product route
		this.router.post(
			"/create-product",
			authorizeUser,
			validateInputs(createProductSchema),
			this.productController.createProduct.bind(this.productController),
		);
		//get all products
		this.router.get(
			"/all-products",
			authorizeUser,
			this.productController.getAllProducts.bind(this.productController),
		);
		//get single product
		this.router.get(
			"/get-single-product/:productId",
			authorizeUser,
			validateInputs(singleProductSchema),
			this.productController.getSingleProduct.bind(this.productController),
		);
		//update the product router
		this.router.patch(
			"/update-product/:productId",
			authorizeUser,
			validateInputs(updateProductSchema),
			this.productController.updateProducts.bind(this.productController),
		);
	}

	public getProductRouter() {
		return this.router;
	}
}
