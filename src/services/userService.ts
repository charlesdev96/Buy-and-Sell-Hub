import { omit } from "lodash";
import { UserAttributes, Users } from "../models";
import { log } from "../utils";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const resgisterUser = async (input: UserAttributes) => {
	try {
		// Destructure the input object
		const { password, ...userData } = input as { password: string };

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

		// Create a new user object with the hashed password
		const user = await Users.create({ ...userData, password: hashedPassword });
		// Omit the password field from the returned user object
		return omit(user["dataValues"], "password");
	} catch (error: any) {
		log.info(error);
	}
};

export const hashPassword = async (password: string) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};

export const findUserByPk = async (id: string) => {
	return Users.findByPk(id);
};

export const findUserByEmail = async (email: string) => {
	return Users.findOne({ where: { email: email } });
};

export const findUserByPhone = async (phoneNumber: string) => {
	return Users.findOne({ where: { phoneNumber: phoneNumber } });
};

export const existingUser = async (phoneNumber: string, email: string) => {
	return Users.findOne({ where: { phoneNumber: phoneNumber, email: email } });
};
