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
			gender: z.enum(["male", "female"]),
			verificationCode: z.string().optional(),
			role: z.enum(["admin", "user", "vendor"]).optional(),
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
			expirationDate: z.date().optional(),
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

export const resendEmailSchema = z.object({
	params: z.object({
		id: z.string(),
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

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({ message: "Invalid email address" }),
	}),
});

export const verifyresetPasswordSchema = z.object({
	params: z.object({
		id: z.string(),
		verificationCode: z.string(),
	}),
	body: z
		.object({
			password: z
				.string({
					required_error: "Password is required",
				})
				.min(6, { message: "Password too short - should be 6 chars minimum" }),
			passwordConfirmation: z.string({
				required_error: "passwordConfirmation is required",
			}),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: "Passwords do not match",
			path: ["passwordConfirmation"],
		}),
});

export type registerUserInput = z.infer<typeof registerUserSchema>["body"];

export type verifyUser = z.infer<typeof verifyUserSchema>["params"];

export type loginInputs = z.infer<typeof loginSchema>["body"];

export type resendEmailInputs = z.infer<typeof resendEmailSchema>["params"];

export type forgotPasswordInputs = z.infer<typeof forgotPasswordSchema>["body"];

export type resetPasswordInputs = z.infer<typeof verifyresetPasswordSchema>;
