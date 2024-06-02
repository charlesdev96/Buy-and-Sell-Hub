import { Response } from "express";
import { createCartInputs } from "../schema";
import {
	createCart,
	checkIfCartExist,
	checkIfProductInUserCart,
	addProductToCart,
	CustomRequest,
	findUserByPk,
	findProductById,
	getAllProductsInCart,
} from "../services";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

export class CartController {
	public async addToCart(req: CustomRequest, res: Response) {
		try {
			const { productId } = req.params as createCartInputs["params"];
			const body = req.body as createCartInputs["body"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			//find user
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check if product exist
			const product = await findProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			//check if user has a cart model already
			const userCartExist = await checkIfCartExist(userId);
			//if user has cart, then check if product is already in cart and if not add it
			if (userCartExist) {
				//check if product is already in cart
				if (!userCartExist.cartId) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ message: "Cart not found" });
				}
				const productInCart = await checkIfProductInUserCart(
					productId,
					userCartExist.cartId,
				);
				//if product is already in cart return error
				if (productInCart) {
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ message: "Product is already in the cart" });
				} else {
					//add product to cart
					await addProductToCart({
						cartId: userCartExist.cartId,
						productId: productId,
					});
					return res.status(StatusCodes.CREATED).json({
						success: true,
						message: "Product added to cart successfully",
					});
				}
			}
			//if user do not have cart, create one and add product
			body.userId = userId;
			const cart = await createCart(body);
			//add product to cart
			await addProductToCart({ cartId: cart.cartId, productId: productId });
			res
				.status(StatusCodes.CREATED)
				.json({ success: true, message: "Product added to cart successfully" });
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to add product to cart due to: ${error.message}`,
			});
		}
	}

	public async getAllUserProductInCart(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			//find user
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const cart = await getAllProductsInCart(userId);
			if (!cart) {
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "You don't have any product in your cart yet",
					data: [],
				});
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of all products in your cart",
				data: cart.cartItems,
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to get product in cart due to: ${error.message}`,
			});
		}
	}
}
