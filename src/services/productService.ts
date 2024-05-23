import { ProductModel, ProductAttributes, Users } from "../models";

export const createNewProduct = async (
	input: ProductAttributes,
	userId: string,
) => {
	await Users.increment("numOfProducts", { by: 1, where: { id: userId } });
	return ProductModel.create(input);
};
