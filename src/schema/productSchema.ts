import { z } from "zod";
import { PRODUCT_CATEGORIES } from "../utils";

export const createProductSchema = z.object({
	body: z.object({
		productId: z.string().optional(),
		productName: z.string({
			required_error: "Please provide a product name",
		}),
		productPic: z.string({
			required_error: "Please provide a product picture",
		}),
		price: z.number({
			required_error: "Please provide a product price",
		}),
		desc: z
			.string()
			.max(500, { message: "Must be 500 or fewer characters long" })
			.optional(),
		quantity: z.number({
			required_error: "Please provide a product quantity",
		}),
		userId: z.string().uuid().optional(),
		storeId: z.string().uuid().optional(),
		category: z.enum(PRODUCT_CATEGORIES, {
			required_error: "Please provide a valid product category",
		}),
	}),
});

export const singleProductSchema = z.object({
	params: z.object({
		productId: z.string({
			required_error: "Please provide the id of the product",
		}),
	}),
});

export const updateProductSchema = z.object({
	body: z.object({
		productName: z.string().optional(),
		productPic: z.string().optional(),
		price: z.number().optional(),
		quantity: z.number().optional(),
		desc: z
			.string()
			.max(500, { message: "Must be 500 or fewer characters long" })
			.optional(),
	}),
	params: z.object({
		productId: z.string({
			required_error: "Please provide the id of the product",
		}),
	}),
});

export const getProductByCategorySchema = z.object({
	query: z.object({
		category: z.enum(PRODUCT_CATEGORIES, {
			required_error: "Please provide a valid product category",
		}),
	}),
});

export const searchProductSchema = z.object({
	query: z.object({
		search: z
			.string({ required_error: "please provide a search criteria" })
			.min(1, { message: "search should not be less than 1" }),
	}),
});

export type createProductInput = z.infer<typeof createProductSchema>["body"];

export type singleProductInputs = z.infer<typeof singleProductSchema>["params"];

export type updateProductInputs = z.infer<typeof updateProductSchema>;

export type getProductByCategoryInputs = z.infer<
	typeof getProductByCategorySchema
>["query"];

export type searchProductInputs = z.infer<typeof searchProductSchema>["query"];
