import { Response } from "express";
import {
	createProductInput,
	singleProductInputs,
	updateProductInputs,
} from "../schema";
import {
	createNewProduct,
	CustomRequest,
	findUserByPk,
	singleProduct,
	allProduct,
	updateProduct,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";
import { ProductModel } from "../models";

export class ProductController {
	public async createProduct(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createProductInput;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check if user is a vendor
			if (user.role !== "vendor" && user.role !== "admin") {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "You are not allowed to access this route" });
			}
			const storeId = user.storeId;
			//check for null
			if (!storeId) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "You are not allowed to access this route" });
			}
			body.userId = userId;
			body.storeId = storeId;
			const product = await createNewProduct(body, userId.toString());

			res.status(StatusCodes.CREATED).json({
				success: true,
				message:
					"Congratulations!, You have successfully created a new product",
				data: product,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to create product", error });
		}
	}

	public async getSingleProduct(req: CustomRequest, res: Response) {
		try {
			const { productId } = req.params as singleProductInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const product = await singleProduct(productId);
			//check if product exist
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Product retrieved successfully.",
				data: product,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to get the product", error: error.message });
		}
	}

	public async getAllProducts(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const products = await allProduct();
			res.status(StatusCodes.OK).json({
				success: true,
				message: "All products have been successfully retrieved.",
				data: products,
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Unable to display all products",
				error: error.message,
			});
		}
	}

	public async updateProducts(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateProductInputs["body"];
			const { productId } = req.params as updateProductInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const product = await ProductModel.findByPk(productId);
			//check if product exists
			if (!product) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "Product not found" });
			}
			//check if the product belong to user
			if (userId !== product.userId) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't update this product. Only the author can make changes.",
				});
			}
			//then proceed to update the product
			await updateProduct(productId, body);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Congratulations, Your product has been successfully updated.",
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Unable to display all products",
				error: error.message,
			});
		}
	}
}
