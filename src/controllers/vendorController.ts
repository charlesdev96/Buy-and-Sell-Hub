import { Response } from "express";
import { updateStoreInputs } from "../schema";
import {
	updateStoreData,
	findUserByPk,
	CustomRequest,
	findStoreByStoreId,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class VendorController {
	public async updateStore(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateStoreInputs["body"];
			const { storeId } = req.params as updateStoreInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Authentication failed: Please login again" });
			}
			const user = await findUserByPk(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check store exist
			const store = await findStoreByStoreId(storeId);
			if (!store) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Store not found" });
			}
			//check if store belongs to user
			if (store.userId !== userId) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Unauthorized: You do not have permission to update this store",
				});
			}
			//proceed to update store
			await updateStoreData(storeId, body);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Congratulation!, your store has been updated successfully",
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to update store data", error });
		}
	}
}
