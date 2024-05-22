import {
	Table,
	Column,
	Index,
	Default,
	DataType,
	Model,
	HasMany,
	HasOne,
	BelongsTo,
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
	verified?: Boolean;
	role?: "admin" | "user";
	gender?: string;
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
	@Column({
		field: "email",
		allowNull: true,
		unique: true,
		type: DataType.STRING(225),
	})
	email?: string;
	@Column({
		field: "phoneNumber",
		allowNull: true,
		unique: true,
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
	verified?: Boolean | undefined;
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
	@HasMany(() => ProductModel)
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
