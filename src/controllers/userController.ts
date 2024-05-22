import { Response } from "express";
import { log } from "../utils";
import { updateUserInput } from "../schema";
import { findUserByPk, CustomRequest, updateuser } from "../services";
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
}
