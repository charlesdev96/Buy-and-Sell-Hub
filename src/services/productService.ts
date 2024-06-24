import {
	ProductModel,
	ProductAttributes,
	Users,
	ReviewModel,
	StoreModel,
} from "../models";
import { Op } from "sequelize";

export const createNewProduct = async (
	input: ProductAttributes,
	userId: string,
) => {
	await Users.increment("numOfProducts", { by: 1, where: { id: userId } });
	return await ProductModel.create(input);
};

export const singleProduct = async (productId: string) => {
	return await ProductModel.findByPk(productId, {
		attributes: {
			exclude: ["quantity", "userId", "storeId"],
		},
		include: [
			{
				model: StoreModel,
				as: "store",
				attributes: ["storeId", "storeName", "storeAddress"],
			},
			{
				model: Users,
				as: "vendor",
				attributes: ["id", "firstName", "lastName", "role"],
			},
			{
				model: ReviewModel,
				as: "reviews",
				attributes: ["reviewId", "comment", "rating", "createdAt", "updatedAt"],
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
	return await ProductModel.findAll({
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

export const getProductByCategory = async (category: string) => {
	return await ProductModel.findAll({
		where: { category: category },
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
	return await ProductModel.update(updates, {
		where: { productId: productId },
	});
};

export const findProductById = async (productId: string) => {
	return await ProductModel.findByPk(productId);
};

export const searchForProducts = async (
	search: string,
): Promise<ProductAttributes[]> => {
	// Construct the search pattern for partial search
	const searchPattern = `%${search}%`;
	// Search for products where desc or productName contains the search string (case insensitive)
	const products = await ProductModel.findAll({
		attributes: [
			"productId",
			"productName",
			"desc",
			"productPic",
			"price",
			"averageRating",
			"category",
		],
		where: {
			[Op.or]: [
				{
					desc: {
						[Op.iLike]: searchPattern, // Adjust based on your database if needed
					},
				},
				{
					productName: {
						[Op.iLike]: searchPattern, // Adjust based on your database if needed
					},
				},
			],
		},
	});
	// Convert the Sequelize model instances into plain objects
	return products.map((product) => product.get({ plain: true }));
};
