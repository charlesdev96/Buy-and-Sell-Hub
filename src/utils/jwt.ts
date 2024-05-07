import * as dotenv from "dotenv";
dotenv.config();
import { sign, verify, JwtPayload } from "jsonwebtoken";

// Create token
export const createJWT = function ({
	payload,
}: {
	payload: JwtPayload;
}): string {
	const token = sign(payload, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});
	return token;
};

// Verify user token
export const isTokenValid = function ({
	token,
}: {
	token: string;
}): JwtPayload {
	return verify(token, process.env.JWT_SECRET!) as JwtPayload;
};
