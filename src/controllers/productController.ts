import { Response } from "express";
import { createProductInput } from "../schema";
import { createNewProduct, CustomRequest, findUserByPk } from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

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
			body.userId = userId;
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
}
