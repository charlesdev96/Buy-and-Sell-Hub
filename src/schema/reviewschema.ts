import { z } from "zod";

export const createReviewSchema = z.object({
	body: z.object({
		reviewId: z.string().optional(),
		comment: z.string().optional(),
		rating: z
			.number()
			.min(1, { message: "Rating must not be less than 1" })
			.max(5, { message: "Rating can not be more than 5" })
			.optional(),
		userId: z.string().optional(),
		productId: z.string().optional(),
	}),
	params: z.object({
		productId: z.string({ required_error: "Please provide the poductId" }),
	}),
});

export type createReviewInputs = z.infer<typeof createReviewSchema>;
