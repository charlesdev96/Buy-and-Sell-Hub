import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateInputs, authorizeUser } from "../middlewares";
import { updateUserSchema, upgradeAccountSchema } from "../schema";

export class UserRouter {
	private router: Router;
	private userController: UserController;
	constructor() {
		this.router = Router();
		this.userController = new UserController();
		this.initializeRoute();
	}
	private initializeRoute() {
		//user profile route
		this.router.get(
			"/user-profile",
			authorizeUser,
			this.userController.userProfile.bind(this.userController),
		);
		//update user
		this.router.patch(
			"/update-user",
			authorizeUser,
			validateInputs(updateUserSchema),
			this.userController.updateProfile.bind(this.userController),
		);
		//upgrade user
		this.router.post(
			"/upgrade-account",
			authorizeUser,
			validateInputs(upgradeAccountSchema),
			this.userController.upgradeAccount.bind(this.userController),
		);
	}
	public getUserRouter() {
		return this.router;
	}
}
