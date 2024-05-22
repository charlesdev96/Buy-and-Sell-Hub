import { Router } from "express";
import { AuthRouter } from "./authRoutes";
import { UserRouter } from "./userRoutes";

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
	}
	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
