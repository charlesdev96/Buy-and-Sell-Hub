import { z } from "zod";

export const storeAddress = z.object({
	street: z.string({ required_error: "Please provide street name" }),
	city: z.string({ required_error: "Please provide city name" }),
	state: z.string({ required_error: "Please provide state name" }),
	country: z.string({ required_error: "Please provide country name" }),
});

export const createStoreSchema = z.object({
	userId: z.string().optional(),
	storeName: z.string({ required_error: "Please provide store name" }).trim(),
	storeAddress: storeAddress.optional(),
});

export const updateStoreSchema = z.object({
	body: z.object({
		storeName: z.string().trim().optional(),
		storeAddress: storeAddress.optional(),
	}),
	params: z.object({
		storeId: z.string({ required_error: "Please provide store id" }).uuid(),
	}),
});

export type updateStoreInputs = z.infer<typeof updateStoreSchema>;
