import { Response } from "express";
import { log } from "../utils";
import { updateUserInput, upgradeAccountInput } from "../schema";
import {
	findUserByPk,
	CustomRequest,
	updateuser,
	createstore,
	storeNameExists,
} from "../services";
import { StatusCodes } from "http-status-codes";

export class UserController {
	public async userProfile(req: CustomRequest, res: Response): Promise<any> {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "User profile successfully displayed",
				data: user,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to display user profile", error });
		}
	}
	public async updateProfile(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateUserInput;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//update user
			await updateuser(userId.toString(), body);
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "User profile successfully updated" });
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to update user", error });
		}
	}

	public async upgradeAccount(req: CustomRequest, res: Response) {
		try {
			const body = req.body as upgradeAccountInput;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Athentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check user has already upgraded account before
			if (user.role !== "user") {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: `You have already changed your role once to ${user.role}. Further changes are not permitted.`,
				});
			}
			//create a store but check if store name exist
			const existingStoreName = await storeNameExists(
				body.store.storeName.toUpperCase(),
			);
			//if name exist return error message
			if (existingStoreName) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Store name already exists, please choose another one",
				});
			}
			//proceed to create store
			body.store.userId = userId;
			body.store.storeName = body.store.storeName.toUpperCase();
			const store = await createstore(body.store);
			//proceed to upgrade account. Note: checks for CAC will be done at the frontend
			user.role = body.role;
			user.storeId = store.storeId;
			await user.save();
			res.status(StatusCodes.OK).json({
				success: true,
				message: `Congratulations, you have successfully upgraded your account to ${body.role} account and a store successfully created`,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to upgrade account", error });
		}
	}
}
