import {
	Model,
	Table,
	Column,
	Index,
	Default,
	BelongsTo,
	DataType,
	HasMany,
	BeforeCreate,
	BeforeUpdate,
	ForeignKey,
} from "sequelize-typescript";
import { ProductCategory } from "../utils";
import { Users, ReviewModel } from "../models";

export interface ProductAttributes {
	productId?: string;
	desc?: string | null;
	productName?: string;
	productPic?: string;
	price?: number;
	averageRating?: number;
	quantity?: number;
	sales?: number;
	reviewId?: string;
	reviews?: ReviewModel[] | [];
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
	@Default(null)
	@Column({ field: "desc", allowNull: true, type: DataType.STRING(1000) })
	desc?: string | null;
	@Column({ field: "productName", allowNull: true, type: DataType.STRING(225) })
	productName?: string;
	@Column({ field: "productPic", allowNull: true, type: DataType.STRING(225) })
	productPic?: string;
	@Column({ field: "price", allowNull: false, type: DataType.DECIMAL(13, 2) })
	price?: number;
	@Default(0.0)
	@Column({
		field: "averageRating",
		allowNull: false,
		type: DataType.DECIMAL(5, 2),
	})
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
	@Column({ field: "reviewId", allowNull: true, type: DataType.UUID })
	reviewId?: string;
	@HasMany(() => ReviewModel)
	reviews?: ReviewModel[] | [];

	@BeforeCreate
	@BeforeUpdate
	static formatValues(instance: ProductModel) {
		//add two extra zeros after decimal point
		if (instance.price !== undefined && instance.price !== null) {
			instance.price = Number(instance.price.toFixed(2));
		}
		if (
			instance.averageRating !== undefined &&
			instance.averageRating !== null
		) {
			instance.averageRating = Number(instance.averageRating.toFixed(2));
		}
	}
}
