import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import { testConnection } from "../config/connectDB";
import { log } from "./utils";
import RouterConfig from "./routes/routes";

const app: Express = express();
const router = new RouterConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router.getRouter());

const port: string | number = process.env.PORT || 3000;

const starter = async (): Promise<any> => {
	await testConnection();
	app.listen(port, () => {
		log.info(`Server started on port ${port}`);
	});
};

starter();

// class App {
// 	public app: Application;
// 	public port: number | string;

// 	constructor() {
// 		this.app = express();
// 		this.port = process.env.PORT || 3000;
// 		this.initializeRoutes();
// 		this.initializeMiddlewares();
// 	}

// 	private initializeMiddlewares(): void {
// 		this.app.use(express.json());
// 		this.app.use(express.urlencoded({ extended: false }));
// 	}

// 	private initializeRoutes(): void {
// 		const routerConfig = new RouterConfig();
// 		this.app.use(routerConfig.getRouter());
// 	}

// 	public async start(): Promise<void> {
// 		await testConnection();
// 		this.app.listen(this.port, () => {
// 			log.info(`Server started on port ${this.port}`);
// 		});
// 	}
// }

// const server = new App();
// server.start();
