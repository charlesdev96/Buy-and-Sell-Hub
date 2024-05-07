import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
	registerUserInput,
	verifyUser,
	loginInputs,
	resendEmailInputs,
	forgotPasswordInputs,
	resetPasswordInputs,
} from "../schema";
import {
	resgisterUser,
	findUserByPk,
	findUserByEmail,
	findUserByPhone,
	existingUser,
	hashPassword,
} from "../services";
import { createJWT, log, sendEmail } from "../utils";
import { StatusCodes } from "http-status-codes";
import { Users } from "../models";

interface CustomRequest extends Request {
	user?: {
		userId?: string;
		email?: string;
	};
}

export class UserAuthentication {
	public async register(
		req: Request<{}, {}, registerUserInput>,
		res: Response,
	) {
		try {
			const body = req.body as registerUserInput;
			const userExist = await existingUser(body.phoneNumber, body.email);
			//if userexist return error
			if (userExist) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "USer already exist" });
			}
			const user = await resgisterUser(body);
			const payload: object = {
				userId: body.id,
				email: body.email,
				phoneNumber: body.phoneNumber,
			};

			const token = createJWT({ payload });

			//send email with verification code
			const { verificationCode, id, email, ...userDAta } = user as {
				verificationCode: string;
				id: string;
				email: string;
			};
			await sendEmail({
				to: email,
				from: "test@example.com",
				subject: "Verify your email/account",
				text: `verification code: ${verificationCode} and your Id is: ${id}`,
			});

			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "user successfully created",
				data: user,
				token: token,
			});
		} catch (error: any) {
			log.info(error);
			log.info("Unable to create user");
		}
	}

	public async resendVerificationEmail(
		req: Request<resendEmailInputs, {}, {}>,
		res: Response,
	) {
		try {
			const id = req.params.id;
			const user = await findUserByPk(id);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Sorry, can not re-send verification code" });
			}
			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is already verified" });
			}
			const email = user.email;
			await sendEmail({
				to: email?.toString(),
				from: "test@example.com",
				subject: "Verify your email/account",
				text: `verification code: ${user.verificationCode} and your Id is: ${id}`,
			});
			res
				.status(StatusCodes.OK)
				.json({ message: "Verification email resent successfully" });
		} catch (error: any) {
			log.info(error);
			log.info("Unable to resend email user");
		}
	}

	public async verifyUserAccount(
		req: Request<verifyUser, {}, {}>,
		res: Response,
	) {
		try {
			const id = req.params.id;
			const verificationCode = req.params.verificationCode;

			// find the user by id
			const user = await findUserByPk(id);

			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Could not verify user" });
			}

			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is already verified" });
			}

			// check to see if the verificationCode matches
			if (user.verificationCode === verificationCode) {
				user.verified = true;
				user.verificationCode = null;
				await user.save();
				return res
					.status(StatusCodes.OK)
					.json({ message: "User successfully verified" });
			}
			//if conditions not certified
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Could not verify user" });
		} catch (error: any) {
			log.info(error);
			if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
				return res.json({ message: "Wrong Id format" });
			}
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Could not verify user" });
		}
	}

	public async login(req: Request<{}, {}, loginInputs>, res: Response) {
		try {
			const body = req.body as loginInputs;
			const message = "Invalid email or password";
			const user = await findUserByEmail(body.email);
			if (!user) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message: message });
			}
			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Please verify your email" });
			}
			//check user password
			const checkPassword: boolean = await user.validatePassword(
				body.password,
				user.password,
			);
			if (!checkPassword) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message });
			}
			const payload: object = {
				userId: user.id,
				email: user.email,
				phoneNumber: user.phoneNumber,
			};

			const token = createJWT({ payload });
			res
				.status(200)
				.json({ message: "Welcome back to Buy and Sell Hub", token });
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to login user", error });
		}
	}

	public async forgotPassword(
		req: Request<{}, {}, forgotPasswordInputs>,
		res: Response,
	) {
		try {
			const { email } = req.body as forgotPasswordInputs;
			const message: string =
				"If a user with that email is registered you will receive a password reset email";
			const user = await findUserByEmail(email);

			if (!user) {
				log.debug(`User with email ${email} does not exists`);
				return res.status(StatusCodes.OK).json({ message });
			}

			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "User not verified" });
			}

			const passwordResetCode = nanoid();
			user.passwordResetCode = passwordResetCode;
			await user.save();
			await sendEmail({
				to: user.email?.toString(),
				from: "test@example.com",
				subject: "Reset your password",
				text: `Password reset code is: ${passwordResetCode} and Id is: ${user.id}`,
			});
			res.status(StatusCodes.OK).json({ message: message });
		} catch (error: any) {
			log.info(error.message);
			res.status(500).send({
				message: "Unable to send message",
				error: error.message,
			});
		}
	}

	public async resetPassword(
		req: Request<
			resetPasswordInputs["params"],
			{},
			resetPasswordInputs["body"]
		>,
		res: Response,
	) {
		try {
			const { id, passwordCode } = req.params as resetPasswordInputs["params"];
			const { password, passwordConfirmation } =
				req.body as resetPasswordInputs["body"];
			const user = await findUserByPk(id);
			if (
				!user ||
				!user.passwordResetCode ||
				user.passwordResetCode.toString() !== passwordCode.toString()
			) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Could not reset user password" });
			}
			user.passwordResetCode = null;
			const newPassword = await hashPassword(password);
			user.password = newPassword;
			await user.save();
			res
				.status(StatusCodes.OK)
				.json({ message: "Successfully updated password" });
		} catch (error: any) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
				message: "Unable to verify password reset code",
				error: error.message,
			});
		}
	}
}
