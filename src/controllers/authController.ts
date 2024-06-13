import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
	registerUserInput,
	verifyUser,
	loginInputs,
	forgotPasswordInputs,
	resetPasswordInputs,
} from "../schema";
import {
	resgisterUser,
	findUserByPk,
	findUserByEmail,
	existingUser,
	hashPassword,
	CustomRequest,
} from "../services";
import { createJWT, log, sendEmail } from "../utils";
import { StatusCodes } from "http-status-codes";
import { Users } from "../models";
import { isAfter, addMinutes } from "date-fns";

export class UserAuthentication {
	public async register(
		req: Request<object, object, registerUserInput>,
		res: Response,
	) {
		try {
			const body = req.body as registerUserInput;
			const userExist = await existingUser(
				body.phoneNumber,
				body.email.toLowerCase(),
			);
			//if userexist return error
			if (userExist) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "USer already exist" });
			}
			body.expirationDate = addMinutes(new Date(), 30);
			const user = await resgisterUser(body);

			//send email with verification code
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { verificationCode, id, email, ...userDAta } = user as {
				verificationCode: string;
				id: string;
				email: string;
				role: string;
			};
			const origin: string = "http://localhost:5000/api/v1";
			const verifyEmail = `${origin}/auth/verify-account/${id}/${verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email,
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${body.firstName} ${body.lastName}</h4> ${message}`,
			});
			const payload: object = {
				userId: id,
				email: email,
				role: user?.role,
			};

			const token = createJWT({ payload });

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

	public async resendVerificationEmail(req: CustomRequest, res: Response) {
		try {
			const userId: string | undefined = req.user?.userId;
			if (!userId) {
				return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
			}
			const user = await findUserByPk(userId);
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
			const origin: string = "http://localhost:5000/api/v1";
			const verifyEmail = `${origin}/auth/verify-account/${userId}/${user.verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email?.toString(),
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${user.firstName} ${user.lastName} </h4> ${message}`,
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
		req: Request<verifyUser, object, object>,
		res: Response,
	) {
		try {
			const { id, verificationCode } = req.params as verifyUser;

			// find the user by id
			const user = await Users.findByPk(id);

			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Could not verify user" });
			}

			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is already verified" });
			}

			// check to see if the verificationCode matches
			if (user.verificationCode?.toString() !== verificationCode.toString()) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "Invalid or expired verification code" });
			}
			//check expiration date
			const currentDate: Date = new Date();
			const expirationDate = user.expirationDate;
			if (!expirationDate) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "No expiration date found" });
			}
			if (isAfter(currentDate, expirationDate)) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "Invalid or expired verification code" });
			}
			user.verificationCode = null;
			user.expirationDate = null;
			await user.save();

			res
				.status(StatusCodes.OK)
				.json({ message: "User successfully verified" });
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Could not verify user" });
		}
	}

	public async login(req: Request<object, object, loginInputs>, res: Response) {
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
		req: Request<object, object, forgotPasswordInputs>,
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

			const verificationCode = nanoid();
			const expirationDate: Date = addMinutes(new Date(), 30);
			user.verificationCode = verificationCode;
			user.expirationDate = expirationDate;
			await user.save();
			await sendEmail({
				to: user.email?.toString(),
				from: "test@example.com",
				subject: "Reset your password",
				text: `Password reset code is: ${verificationCode} and Id is: ${user.id}`,
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
			object,
			resetPasswordInputs["body"]
		>,
		res: Response,
	) {
		try {
			const { id, verificationCode } =
				req.params as resetPasswordInputs["params"];
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, passwordConfirmation } =
				req.body as resetPasswordInputs["body"];
			const user = await findUserByPk(id);
			if (
				!user ||
				!user.verificationCode ||
				user.verificationCode.toString() !== verificationCode.toString()
			) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Invalid or expired verification code" });
			}
			//check if verification has expired
			const currentDate: Date = new Date();
			const expirationDate = user.expirationDate;
			if (!expirationDate) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "No expiration date found" });
			}
			if (isAfter(currentDate, expirationDate)) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Invalid or expired verification code" });
			}
			user.verificationCode = null;
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
