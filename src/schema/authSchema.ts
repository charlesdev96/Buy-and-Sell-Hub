import { z } from "zod";

export const registerUserSchema = z.object({
	body: z
		.object({
			id: z.string().uuid({ message: "Invalid UUID" }).optional(),
			firstName: z.string({
				required_error: "firstName is required",
			}),
			lastName: z.string({
				required_error: "lastName is required",
			}),
			phoneNumber: z.string({
				required_error: "Phone number is required",
			}),
			age: z.string({
				required_error: "age is required",
			}),
			gender: z.string({
				required_error: "gender is required",
			}),
			verificationCode: z.string().optional(),
			dob: z
				.string({
					required_error: "gender is required",
				})
				.date(),
			password: z
				.string({
					required_error: "Password is required",
				})
				.min(6, { message: "Password too short - should be 6 chars minimum" }),
			passwordConfirmation: z.string({
				required_error: "passwordConfirmation is required",
			}),
			email: z
				.string({
					required_error: "Email is required",
				})
				.email({ message: "Invalid email address" }),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: "Passwords do not match",
			path: ["passwordConfirmation"],
		}),
});

export const verifyUserSchema = z.object({
	params: z.object({
		id: z.string(),
		verificationCode: z.string(),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({ message: "Invalid email address" }),
		password: z
			.string({
				required_error: "Password is required",
			})
			.min(6, "Invalid email or password"),
	}),
});

export type registerUserInput = z.infer<typeof registerUserSchema>["body"];

export type verifyUser = z.infer<typeof verifyUserSchema>["params"];

export type loginInputs = z.infer<typeof loginSchema>["body"];
