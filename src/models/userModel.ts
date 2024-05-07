import {
	Table,
	Column,
	Index,
	Default,
	DataType,
	Model,
	HasMany,
	HasOne,
	BeforeSave,
} from "sequelize-typescript";
import { compare } from "bcryptjs";

import { nanoid } from "nanoid";

export interface UserAttributes {
	id?: String;
	firstName?: String;
	lastName?: String;
	email?: String;
	password?: String;
	phoneNumber?: String;
	verificationCode?: String | null;
	verified?: Boolean;
	role?: "admin" | "user";
	gender?: String;
	age?: String;
	dob?: String;
	passwordResetCode?: String | null;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "users", timestamps: true })
export class Users
	extends Model<UserAttributes, UserAttributes>
	implements UserAttributes
{
	@Default(DataType.UUIDV4)
	@Index({ name: "custom_index_name", unique: true, using: "BTREE" })
	@Column({ field: "id", primaryKey: true, type: DataType.UUID, unique: true })
	id?: string;
	@Column({ field: "firstName", allowNull: true, type: DataType.STRING(225) })
	firstName?: String;
	@Column({ field: "lastName", allowNull: true, type: DataType.STRING(225) })
	lastName?: String;
	@Column({ field: "password", allowNull: true, type: DataType.STRING(225) })
	password?: String;
	@Column({
		field: "email",
		allowNull: true,
		unique: true,
		type: DataType.STRING(225),
	})
	email?: String;
	@Column({
		field: "phoneNumber",
		allowNull: true,
		unique: true,
		type: DataType.STRING(225),
	})
	phoneNumber?: String;
	@Default(nanoid())
	@Column({
		field: "verificationCode",
		allowNull: true,
		type: DataType.STRING(),
	})
	verificationCode?: String | null;
	@Default(false)
	@Column({ field: "verified", allowNull: true, type: DataType.BOOLEAN })
	verified?: Boolean | undefined;
	@Default("user")
	@Column({ field: "role", allowNull: true, type: DataType.STRING(225) })
	role?: "admin" | "user";
	@Column({ field: "gender", allowNull: true, type: DataType.STRING(225) })
	gender?: String;
	@Column({ field: "age", allowNull: true, type: DataType.STRING(225) })
	age?: String;
	@Column({ field: "dob", allowNull: true, type: DataType.STRING(225) })
	dob?: String;
	@Default(null)
	@Column({
		field: "passwordResetCode",
		allowNull: true,
		type: DataType.STRING(),
	})
	passwordResetCode?: String | null;
	@Column({ field: "createdAt", allowNull: true, type: DataType.DATE })
	createdAt?: Date;
	@Column({ field: "updatedAt", allowNull: true, type: DataType.DATE })
	updatedAt?: Date;

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
