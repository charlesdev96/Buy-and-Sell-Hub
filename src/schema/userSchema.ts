import { z } from "zod";

export const updateUserSchema = z.object({
	body: z
		.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().email({ message: "Invalid email address" }).optional(),
			newPassword: z.string().optional(),
			passwordConfirmation: z.string().optional(),
			phoneNumber: z.string().optional(),
			role: z.enum(["admin", "user"]).optional(),
			gender: z.string().optional(),
			age: z.string().optional(),
			dob: z.string().optional(),
		})
		.refine((data) => data.newPassword === data.passwordConfirmation, {
			message: "Passwords do not match",
			path: ["passwordConfirmation"],
		}),
});

export type updateUserInput = z.infer<typeof updateUserSchema>["body"];
