import { Response } from "express";
import { createReviewInputs } from "../schema";
import {
	CustomRequest,
	reviewProduct,
	findUserByPk,
	findProductById,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class ReviewController {
	public async createReview(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createReviewInputs["body"];
			const { productId } = req.params as createReviewInputs["params"];
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
			//find product to be reviewed
			const product = await findProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			body.productId = productId;
			body.userId = userId;
			//since comment and rating are optional, one has to be present
			if (!body.comment && !body.rating) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Please provide comment or rating" });
			}
			//proceed to create review
			const review = await reviewProduct(body, productId);
			// Calculate the average rating of the product
			const currentRating = product.averageRating || 0;
			const currentNumReviews = product.numOfReviews || 0;
			const rating = body.rating || 0;
			//since i have already autoincrement the numOfReviews, we remove it
			const newAveRating =
				(currentRating * (currentNumReviews - 1) + rating) / currentNumReviews;
			product.averageRating = newAveRating;
			//save updated product
			await product.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message:
					"Thank you! Your comment/rating has been successfully submitted.",
				data: review,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to review product", error });
		}
	}
}
