import { Response } from "express";
import { createReviewInputs, updateReviewInput } from "../schema";
import {
	CustomRequest,
	reviewProduct,
	findUserByPk,
	findProductById,
	checkUsersReviews,
	updateReviewFunction,
	findReviewById,
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
			//check if user has reviewed before
			const existingReview = await checkUsersReviews(userId, productId);
			//if user have rated before, instruct them to update their reviews
			if (existingReview) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message:
						"You've already reviewed this product. Please update your previous review.",
				});
			}
			//proceed to create review
			const review = await reviewProduct(body, productId);
			// Calculate the average rating of the product
			const currentRating = product.averageRating || 0;
			const currentNumReviews = product.numOfReviews || 0;
			const newNumOfReviews = currentNumReviews + 1;
			const rating = body.rating || 0;
			const totalRating = currentRating * currentNumReviews;
			//since i have already autoincrement the numOfReviews, we remove it
			const newAveRating = (totalRating + rating) / newNumOfReviews;
			product.averageRating = newAveRating;
			//save updated product
			await product.update({ averageRating: newAveRating });
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

	public async updateReview(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateReviewInput["body"];
			const { reviewId } = req.params as updateReviewInput["params"];
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
			//check if review exist
			const review = await findReviewById(reviewId);
			if (!review) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Review not found" });
			}
			//check if review belongs to user
			if (review.userId !== userId) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Only the original reviewer can update this review. Thanks for understanding!",
				});
			}
			//find product been reviewed
			const productId = review.productId;
			if (!productId) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Can't find productId" });
			}
			const product = await findProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			//update the avearge review of the product
			if (body.rating !== undefined) {
				const oldRating = review.rating || 0;
				const oldAveRating = product?.averageRating || 0;
				const numOfReviews = product?.numOfReviews || 0;
				const newAveRating =
					(oldAveRating * numOfReviews - oldRating + body.rating) /
					numOfReviews;
				product.averageRating = newAveRating;
				await product.save();
				// await product.update({averageRating: newAveRating})
			}
			//proceed to update post
			await updateReviewFunction(reviewId, body);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Your review has been updated successfully.",
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to update review", error });
		}
	}
}
