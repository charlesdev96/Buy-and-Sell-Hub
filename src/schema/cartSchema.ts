import { z } from "zod";

export const createCartSchema = z.object({
	body: z.object({
		userId: z.string().uuid().optional(),
	}),
	params: z.object({
		productId: z.string({ required_error: "product id is required" }),
	}),
});

export type createCartInputs = z.infer<typeof createCartSchema>;
