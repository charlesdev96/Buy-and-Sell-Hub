import {
	Model,
	Default,
	Table,
	Column,
	DataType,
	Index,
	ForeignKey,
	BelongsTo,
	BelongsToMany,
} from "sequelize-typescript";
import { ProductModel, Users, CartItemModel } from "../models";
import { idGenerator } from "../utils";

export interface CartAttributes {
	cartId?: string;
	userId?: string;
	owner?: Users;
	cartItems?: ProductModel[];
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "Cart", timestamps: true })
export class CartModel
	extends Model<CartAttributes, CartAttributes>
	implements CartAttributes
{
	@Default(() => idGenerator())
	@Index({ name: "cart_id_index", unique: true, using: "BTREE" })
	@Column({ field: "cartId", primaryKey: true, type: DataType.STRING(225) })
	cartId?: string;
	@ForeignKey(() => Users)
	@Column({ field: "userId", allowNull: true, type: DataType.UUID })
	userId?: string;
	@BelongsTo(() => Users, {
		constraints: false,
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	owner?: Users;
	@BelongsToMany(() => ProductModel, () => CartItemModel)
	cartItems?: ProductModel[];
}
