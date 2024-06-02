import { customAlphabet } from "nanoid";

export const idGenerator = function (): string {
	const ID = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
	return ID(10);
};
