import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const message: string =
	"Oops! It seems like the route you selected does not exist. Please choose another route or contact support for assistance.";

export const notFound = async (req: Request, res: Response) => {
	return res.status(StatusCodes.NOT_FOUND).send(message);
};
