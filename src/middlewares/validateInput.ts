import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateInputs =
	(schema: z.AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (e: any) {
			return res.status(400).send(e.errors);
		}
	};
