import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authorizeUser, validateInputs } from "../middlewares";
import { createProductSchema } from "../schema";

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
	}

	public getProductRouter() {
		return this.router;
	}
}
