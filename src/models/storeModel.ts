import {
	Table,
	Model,
	Column,
	Index,
	ForeignKey,
	BelongsTo,
	HasMany,
	Default,
	DataType,
	BeforeSave,
	BeforeCreate,
} from "sequelize-typescript";

import { Users, ProductModel } from "../models";

export interface storeAddress {
	street?: string | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
}

export interface StoreAttributes {
	storeId?: string;
	storeName?: string;
	products?: ProductModel[];
	userId?: string;
	vendor?: Users;
	storeAddress?: storeAddress[] | null;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "Store", timestamps: true })
export class StoreModel
	extends Model<StoreAttributes, StoreAttributes>
	implements StoreAttributes
{
	@Default(DataType.UUIDV4)
	@Index({ name: "store_id_index", unique: true, using: "BTREE" })
	@Column({ field: "storeId", primaryKey: true, type: DataType.UUID })
	storeId?: string;
	@Index({ name: "storeName_id_index", unique: true, using: "BTREE" })
	@Column({ field: "storeName", allowNull: true, type: DataType.STRING(225) })
	storeName?: string;
	@Column({
		field: "storeAddress",
		allowNull: true,
		type: DataType.JSON,
	})
	storeAddress?: storeAddress[] | null;
	@ForeignKey(() => Users)
	@Column({ field: "userId", allowNull: true, type: DataType.UUID })
	userId?: string;
	@BelongsTo(() => Users, {
		constraints: false,
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	vendor?: Users;
	@HasMany(() => ProductModel, { constraints: false })
	products?: ProductModel[] | [];

	@BeforeCreate
	@BeforeSave
	static formatValues(instance: StoreModel) {
		if (instance.storeName !== undefined && instance.storeName !== null) {
			instance.storeName = instance.storeName.toUpperCase();
		}
	}
}
