import { Router } from "express";
import { AuthRouter } from "./authRoutes";
import { UserRouter } from "./userRoutes";
import { ProductRouter } from "./productRoute";
import { ReviewRouter } from "./reviewRoute";
import { VendorRouter } from "./vendorRoute";
import { CartRouter } from "./cartRoutes";

class RouterConfig {
	private router: Router;
	constructor() {
		this.router = Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		const baseUrl: string = "/api/v1";

		this.router.use(`${baseUrl}/auth`, new AuthRouter().getAuthRouter());
		this.router.use(`${baseUrl}/user`, new UserRouter().getUserRouter());
		this.router.use(
			`${baseUrl}/product`,
			new ProductRouter().getProductRouter(),
		);
		this.router.use(`${baseUrl}/review`, new ReviewRouter().getReviewRouter());
		this.router.use(`${baseUrl}/vendor`, new VendorRouter().getVendorRouter());
		this.router.use(`${baseUrl}/cart`, new CartRouter().getCartRouter());
	}
	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
