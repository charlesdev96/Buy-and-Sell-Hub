import {
	DataType,
	Model,
	Column,
	ForeignKey,
	Table,
	Default,
	Index,
	BelongsTo,
} from "sequelize-typescript";

import { CartModel, ProductModel } from ".";
import { idGenerator } from "../utils";

export interface CartItemAttribute {
	cartItemId?: string;
	cartId?: string;
	productId?: string;
	cart?: CartModel;
	product?: ProductModel;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "cart-item", timestamps: true })
export class CartItemModel
	extends Model<CartItemAttribute, CartItemAttribute>
	implements CartItemAttribute
{
	@Default(() => idGenerator())
	@Index({ name: "cartitem_id_index", unique: true, using: "BTREE" })
	@Column({
		field: "cartItemId",
		primaryKey: true,
		allowNull: true,
		type: DataType.STRING(225),
	})
	cartItemId?: string;
	@ForeignKey(() => CartModel)
	@Column({ field: "cartId", allowNull: true, type: DataType.STRING(225) })
	cartId!: string;
	@ForeignKey(() => ProductModel)
	@Column({ field: "productId", allowNull: true, type: DataType.UUID })
	productId!: string;
	@BelongsTo(() => ProductModel, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	product?: ProductModel;
	@BelongsTo(() => CartModel, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	cart?: CartModel;
}
