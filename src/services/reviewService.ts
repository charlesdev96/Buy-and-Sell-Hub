import { ReviewAttributes, ReviewModel, ProductModel } from "../models";

export const reviewProduct = async (
	input: ReviewAttributes,
	productId: string,
) => {
	await ProductModel.increment("numOfReviews", {
		by: 1,
		where: { productId: productId },
	});
	return await ReviewModel.create(input);
};

export const checkUsersReviews = async (userId: string, productId: string) => {
	return await ReviewModel.findOne({
		where: { userId: userId, productId: productId },
	});
};

export const updateReviewFunction = async (
	reviewId: string,
	updates: Partial<ReviewAttributes>,
) => {
	return await ReviewModel.update(updates, { where: { reviewId: reviewId } });
};

export const findReviewById = async (reviewId: string) => {
	return await ReviewModel.findByPk(reviewId);
};
