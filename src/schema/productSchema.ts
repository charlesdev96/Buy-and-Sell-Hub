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
		quantity: z.number({
			required_error: "Please provide a product quantity",
		}),
		userId: z.string().uuid().optional(),
		category: z.enum(PRODUCT_CATEGORIES, {
			required_error: "Please provide a valid product category",
		}),
	}),
});

export type createProductInput = z.infer<typeof createProductSchema>["body"];
