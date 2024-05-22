import { Request, Response, NextFunction } from "express";
import { isTokenValid } from "../utils";

interface TokenPayLoad {
	userId: string;
	email: string;
	role: string;
}

interface CustomRequest extends Request {
	user?: {
		userId: string;
		email: string;
		role: string;
	};
}

export const authorizeUser = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	// Check header
	const authHeader: string | undefined = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res.status(403).json({ error: "Authentication invalid" });
	}
	const token = authHeader.split(" ")[1];
	try {
		// Check if token is valid and get payload
		const payload = isTokenValid({ token }) as TokenPayLoad;

		// Attach the user to the request object
		req.user = {
			userId: payload.userId,
			email: payload.email,
			role: payload.role,
		};
		next();
	} catch (error: any) {
		res.status(403).json({ message: "Authentication invalids", error: error });
	}
};
