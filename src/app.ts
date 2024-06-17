import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { testConnection } from "../config/connectDB";
import { log } from "./utils";
import RouterConfig from "./routes/routes";
import { notFound } from "./middlewares";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

class AppStarter {
	private app: Express;
	private port: number | string;

	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;
		this.initializeMiddlewares();
		this.initializeRoutes();
	}

	private initializeMiddlewares(): void {
		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 100,
			handler: (req: Request, res: Response) => {
				res.status(429).json({ error: "Too many requests" });
			},
		});
		this.app.use(limiter);
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
	}

	private initializeRoutes(): void {
		this.app.use(new RouterConfig().getRouter());
		this.app.use(notFound);
	}

	public async starter(): Promise<void> {
		await testConnection();
		this.app.listen(this.port, () => {
			log.info(`Server started on port ${this.port}`);
		});
	}
}

const server = new AppStarter();
server.starter();
