import { Request, Response } from "express";
import { registerUserInput, verifyUser, loginInputs } from "../schema";
import {
	resgisterUser,
	findUserByPk,
	findUserByEmail,
	findUserByPhone,
	existingUser,
	validatePassword,
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
		} catch (error) {
			log.info(error);
			log.info("Unable to create user");
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
			const user: Users | null = await findUserByEmail(body.email);
			if (!user) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message: message });
			}
			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Please verify your email" });
			}
			//check user password
			const { password, ...userDAta } = user as unknown as { password: string };
			const checkPassword = await validatePassword(password, body.password);
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
}
