import { Router } from "express";
import { CartController } from "../controllers/cartController";
import { authorizeUser, validateInputs } from "../middlewares";
import { createCartSchema, removeItemSchema } from "../schema";

export class CartRouter {
	private router: Router;
	private cartController: CartController;
	constructor() {
		this.router = Router();
		this.cartController = new CartController();
		this.initializeRoute();
	}
	private initializeRoute() {
		//add product to cart
		this.router.post(
			"/add-to-cart/:productId",
			authorizeUser,
			validateInputs(createCartSchema),
			this.cartController.addToCart.bind(this.cartController),
		);
		//get user cart
		this.router.get(
			"/get-cart",
			authorizeUser,
			this.cartController.getAllUserProductInCart.bind(this.cartController),
		);
		//remove item from cart
		this.router.delete(
			"/remove-item/:productId",
			authorizeUser,
			validateInputs(removeItemSchema),
			this.cartController.removeItem.bind(this.cartController),
		);
	}

	public getCartRouter() {
		return this.router;
	}
}
