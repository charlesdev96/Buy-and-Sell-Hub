import { StoreModel, StoreAttributes } from "../models";

export const createstore = async (input: StoreAttributes) => {
	return await StoreModel.create(input);
};

export const storeNameExists = async (storeName: string) => {
	return await StoreModel.findOne({
		where: { storeName: storeName.toUpperCase() },
	});
};

export const findStoreByUserId = async (userId: string) => {
	return await StoreModel.findOne({ where: { userId: userId } });
};

export const findStoreByStoreId = async (storeId: string) => {
	return await StoreModel.findOne({ where: { storeId: storeId } });
};

export const updateStoreData = async (
	storeId: string,
	updates: Partial<StoreAttributes>,
) => {
	return await StoreModel.update(updates, { where: { storeId: storeId } });
};
