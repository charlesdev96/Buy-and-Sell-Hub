import { config } from "dotenv";
config();
import nodemailer, { SendMailOptions } from "nodemailer";
import { log } from "./index";

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "lucas49@ethereal.email",
		pass: "sPVB3raUGpg22TfjAb",
	},
});

export async function sendEmail(payload: SendMailOptions) {
	transporter.sendMail(payload, (err, info) => {
		if (err) {
			log.error(err, "Error sending email");
			return;
		}

		log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
}
