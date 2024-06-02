import {
	CartAttributes,
	CartModel,
	CartItemModel,
	CartItemAttribute,
} from "../models";

export const createCart = async (input: CartAttributes) => {
	return await CartModel.create(input);
};

export const checkIfCartExist = async (userId: string) => {
	return await CartModel.findOne({ where: { userId: userId } });
};

export const checkIfProductInUserCart = async (
	productId: string,
	cartId: string,
) => {
	return await CartItemModel.findOne({
		where: { productId: productId, cartId: cartId },
	});
};

export const addProductToCart = async (input: CartItemAttribute) => {
	return await CartItemModel.create(input);
};
