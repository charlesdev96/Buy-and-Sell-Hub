import {
	Model,
	Table,
	Column,
	Index,
	Default,
	BelongsTo,
	DataType,
	BeforeCreate,
	BeforeUpdate,
	ForeignKey,
} from "sequelize-typescript";
import { ProductCategory } from "../utils";
import { Users } from "../models";

export interface ProductAttributes {
	productId?: string;
	productName?: string;
	productPic?: string;
	price?: number;
	averageRating?: number;
	quantity?: number;
	sales?: number;
	userId?: string;
	vendor?: Users;
	category?: ProductCategory;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "Products", timestamps: true })
export class ProductModel
	extends Model<ProductAttributes, ProductAttributes>
	implements ProductAttributes
{
	@Default(DataType.UUIDV4)
	@Index({ name: "product_id_index", unique: true, using: "BTREE" })
	@Column({
		field: "productId",
		primaryKey: true,
		type: DataType.UUID,
		unique: true,
	})
	productId?: string;
	@Column({ field: "productName", allowNull: true, type: DataType.STRING(225) })
	productName?: string;
	@Column({ field: "productPic", allowNull: true, type: DataType.STRING(225) })
	productPic?: string;
	@Column({ field: "price", allowNull: false, type: DataType.INTEGER })
	price?: number;
	@Default(0.0)
	@Column({ field: "averageRating", allowNull: false, type: DataType.FLOAT })
	averageRating?: number;
	@Column({ field: "quantity", allowNull: false, type: DataType.INTEGER })
	quantity?: number;
	@Default(0)
	@Column({ field: "sales", allowNull: false, type: DataType.INTEGER })
	sales?: number;
	@Column({ field: "category", allowNull: true, type: DataType.STRING() })
	category?: ProductCategory;
	@ForeignKey(() => Users)
	@Column({ field: "userId", allowNull: true, type: DataType.UUID })
	userId?: string;
	@BelongsTo(() => Users, { constraints: false })
	vendor?: Users;

	@BeforeCreate
	@BeforeUpdate
	static formatValues(instance: ProductModel) {
		//add two extra zeros after decimal point
		if (instance.price !== undefined && instance.price !== null) {
			instance.price = parseFloat(instance.price.toFixed(2));
		}
		if (
			instance.averageRating !== undefined &&
			instance.averageRating !== null
		) {
			instance.averageRating = parseFloat(instance.averageRating.toFixed(2));
		}
	}
}
