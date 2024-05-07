import { Router } from "express";
import { UserRouter } from "./authRoutes";

class RouterConfig {
	private router: Router;
	constructor() {
		this.router = Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		const baseUrl: string = "/api/v1";

		this.router.use(`${baseUrl}/auth`, new UserRouter().getAuthRouter());
	}
	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
