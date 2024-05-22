import * as dotenv from "dotenv";
dotenv.config();
import { log } from "../src/utils";

import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { Users, ProductModel } from "../src/models/index";
import cron from "node-cron";
import { EventEmitter } from "events";

export const sequelize = new Sequelize({
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

// logging: (sql, timing) => {
// 	log.info(`Executing SQL: ${sql}`);
// 	log.info(`Query timing: ${timing} ms`);
// }, // Disable logging SQL queries (optional)

sequelize.addModels([Users, ProductModel]);

// Function to delete unverified users created more than 30 minutes ago
const deleteUnverifiedUsers = async () => {
	try {
		// Calculate the time 30 minutes ago
		const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

		// Find unverified users created more than 30 minutes ago
		const unverifiedUsers = await Users.findAll({
			where: {
				verified: false,
				createdAt: { [Op.lt]: thirtyMinutesAgo },
			},
		});

		// Delete each unverified user
		for (const user of unverifiedUsers) {
			await user.destroy();
			log.info(`User ${user.id} deleted.`);
		}

		log.info("All unverified users deleted successfully.");
	} catch (error: any) {
		log.info("Error deleting unverified users:", error);
	}
};

// Schedule the function to run periodically (e.g., every minute)

cron.schedule("*/5 * * * *", async () => {
	log.info("Running deleteUnverifiedUsers task...");
	await deleteUnverifiedUsers();
});

// Listener for user creation event
const userCreatedEmitter: any = new EventEmitter();
// Assuming you have an event emitter for user creation events called 'userCreatedEmitter'
userCreatedEmitter.on("userCreated", async (user: Users) => {
	// Set up a timer to check the verification status after 30 minutes
	setTimeout(
		async () => {
			// Check if the user is still unverified after 30 minutes
			const userRecord = await Users.findByPk(user.id);
			if (userRecord && !userRecord.verified) {
				// If unverified, delete the user
				await userRecord.destroy();
				log.info(`User ${user.id} deleted due to lack of verification.`);
			}
		},
		30 * 60 * 1000,
	); // 30 minutes
});

//test the connection
export const testConnection = async function (): Promise<void> {
	try {
		await sequelize
			.sync({ force: false, alter: true })
			.then(() => {
				log.info("All models are successfully synced");
			})
			.catch((error: any) => {
				log.info(error);
			});
		await sequelize.authenticate();
		log.info("Connection has been established successfully.");
	} catch (error: any) {
		log.info("Unable to connect to the database:", error);
	}
};
