import { ProductModel, ProductAttributes, Users, ReviewModel } from "../models";

export const createNewProduct = async (
	input: ProductAttributes,
	userId: string,
) => {
	await Users.increment("numOfProducts", { by: 1, where: { id: userId } });
	return ProductModel.create(input);
};

export const singleProduct = async (productId: string) => {
	return ProductModel.findByPk(productId, {
		attributes: {
			exclude: ["quantity", "userId"],
		},
		include: [
			{
				model: Users,
				as: "vendor",
				attributes: ["id", "firstName", "LastName"],
			},
			{
				model: ReviewModel,
				as: "reviews",
				attributes: ["reviewId", "comment", "rating"],
				include: [
					{
						model: Users,
						as: "reviewedBy",
						attributes: ["id", "firstName", "lastName"],
					},
				],
			},
		],
	});
};

export const allProduct = async () => {
	return ProductModel.findAndCountAll({
		attributes: [
			"productId",
			"productName",
			"desc",
			"productPic",
			"price",
			"averageRating",
			"category",
		],
	});
};

export const updateProduct = async (
	productId: string,
	updates: Partial<ProductAttributes>,
) => {
	return ProductModel.update(updates, { where: { productId: productId } });
};
