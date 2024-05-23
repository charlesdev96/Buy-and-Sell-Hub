import { Router } from "express";
import { UserAuthentication } from "../controllers/authController";
import { validateInputs, authorizeUser } from "../middlewares";
import {
	registerUserSchema,
	verifyUserSchema,
	loginSchema,
	resendEmailSchema,
	forgotPasswordSchema,
	verifyresetPasswordSchema,
} from "../schema";

export class AuthRouter {
	private router: Router;
	private userAuthentication: UserAuthentication;
	constructor() {
		this.router = Router();
		this.userAuthentication = new UserAuthentication();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//register user
		this.router.post(
			"/register",
			validateInputs(registerUserSchema),
			this.userAuthentication.register.bind(this.userAuthentication),
		);
		//resend verification email
		this.router.post(
			"/resend-email",
			authorizeUser,
			this.userAuthentication.resendVerificationEmail.bind(
				this.userAuthentication,
			),
		);
		//verify login user
		this.router.post(
			"/login",
			validateInputs(loginSchema),
			this.userAuthentication.login.bind(this.userAuthentication),
		);
		//forgot password user
		this.router.post(
			"/forgot-password",
			validateInputs(forgotPasswordSchema),
			this.userAuthentication.forgotPassword.bind(this.userAuthentication),
		);
		//verify user email user
		this.router.post(
			"/verify-account/:id/:verificationCode",
			validateInputs(verifyUserSchema),
			this.userAuthentication.verifyUserAccount.bind(this.userAuthentication),
		);
		//reset password user
		this.router.post(
			"/reset-password/:id/:passwordCode",
			validateInputs(verifyresetPasswordSchema),
			this.userAuthentication.resetPassword.bind(this.userAuthentication),
		);
	}
	public getAuthRouter() {
		return this.router;
	}
}
