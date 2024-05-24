import { Router } from "express";
import { VendorController } from "../controllers/vendorController";
import { updateStoreSchema } from "../schema";
import { validateInputs, authorizeUser } from "../middlewares";

export class VendorRouter {
	private router: Router;
	private vendorController: VendorController;
	constructor() {
		this.router = Router();
		this.vendorController = new VendorController();
		this.initializeRoute();
	}

	private initializeRoute() {
		//update store route
		this.router.patch(
			"/update-store/:storeId",
			authorizeUser,
			validateInputs(updateStoreSchema),
			this.vendorController.updateStore.bind(this.vendorController),
		);
	}

	public getVendorRouter() {
		return this.router;
	}
}
