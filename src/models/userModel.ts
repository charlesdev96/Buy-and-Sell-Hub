import {
	Table,
	Column,
	Index,
	Default,
	DataType,
	Model,
	HasMany,
	HasOne,
} from "sequelize-typescript";
import { compare } from "bcryptjs";
import { ProductModel } from "../models";

import { nanoid } from "nanoid";

export interface UserAttributes {
	id?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	phoneNumber?: string;
	verificationCode?: string | null;
	verified?: boolean;
	role?: "admin" | "user";
	gender?: string;
	numOfProducts?: number;
	age?: string;
	dob?: string;
	products?: ProductModel[] | [];
	passwordResetCode?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "users", timestamps: true })
export class Users
	extends Model<UserAttributes, UserAttributes>
	implements UserAttributes
{
	@Default(DataType.UUIDV4)
	@Index({ name: "user_id_index", unique: true, using: "BTREE" })
	@Column({ field: "id", primaryKey: true, type: DataType.UUID, unique: true })
	id?: string;
	@Column({ field: "firstName", allowNull: true, type: DataType.STRING(225) })
	firstName?: string;
	@Column({ field: "lastName", allowNull: true, type: DataType.STRING(225) })
	lastName?: string;
	@Column({ field: "password", allowNull: true, type: DataType.STRING(225) })
	password?: string;
	@Index({ name: "email_index", unique: true })
	@Column({
		field: "email",
		allowNull: true,
		type: DataType.STRING(225),
	})
	email?: string;
	@Index({ name: "phone_index", unique: true })
	@Column({
		field: "phoneNumber",
		allowNull: true,
		type: DataType.STRING(225),
	})
	phoneNumber?: string;
	@Default(nanoid())
	@Column({
		field: "verificationCode",
		allowNull: true,
		type: DataType.STRING(),
	})
	verificationCode?: string | null;
	@Default(false)
	@Column({ field: "verified", allowNull: true, type: DataType.BOOLEAN })
	verified?: boolean | undefined;
	@Default(0)
	@Column({ field: "numOfProducts", allowNull: true, type: DataType.INTEGER })
	numOfProducts?: number;
	@Default("user")
	@Column({ field: "role", allowNull: true, type: DataType.STRING(225) })
	role?: "admin" | "user";
	@Column({ field: "gender", allowNull: true, type: DataType.STRING(225) })
	gender?: string;
	@Column({ field: "age", allowNull: true, type: DataType.STRING(225) })
	age?: string;
	@Column({ field: "dob", allowNull: true, type: DataType.STRING(225) })
	dob?: string;
	@Default(null)
	@Column({
		field: "passwordResetCode",
		allowNull: true,
		type: DataType.STRING(),
	})
	passwordResetCode?: string | null;
	@Column({ field: "createdAt", allowNull: true, type: DataType.DATE })
	createdAt?: Date;
	@Column({ field: "updatedAt", allowNull: true, type: DataType.DATE })
	updatedAt?: Date;
	@HasMany(() => ProductModel, { constraints: false })
	products?: ProductModel[] | [];

	// Method to validate password
	public async validatePassword(
		password: string,
		userPassword: Users["password"],
	): Promise<boolean> {
		if (!userPassword) {
			return false; // Password not set
		}
		return compare(password, userPassword.toString());
	}
}