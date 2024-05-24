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
