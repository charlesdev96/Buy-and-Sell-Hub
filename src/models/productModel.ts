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
	BelongsToMany,
} from "sequelize-typescript";
import { ProductCategory } from "../utils";
import {
	Users,
	ReviewModel,
	StoreModel,
	CartModel,
	CartItemModel,
} from "../models";

export interface ProductAttributes {
	productId?: string;
	desc?: string | null;
	productName?: string;
	productPic?: string;
	price?: number;
	averageRating?: number;
	quantity?: number;
	sales?: number;
	numOfReviews?: number;
	reviews?: ReviewModel[] | [];
	cart?: CartModel[];
	userId?: string;
	storeId?: string;
	vendor?: Users;
	store?: StoreModel;
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
	@Default(0)
	@Column({ field: "numOfReviews", allowNull: false, type: DataType.INTEGER })
	numOfReviews?: number;
	@Column({ field: "category", allowNull: true, type: DataType.STRING() })
	category?: ProductCategory;
	@ForeignKey(() => Users)
	@Column({ field: "userId", allowNull: true, type: DataType.UUID })
	userId?: string;
	@BelongsTo(() => Users, {
		constraints: false,
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	vendor?: Users;
	@HasMany(() => ReviewModel)
	reviews?: ReviewModel[] | [];
	@ForeignKey(() => StoreModel)
	@Column({ field: "storeId", allowNull: true, type: DataType.UUID })
	storeId?: string;
	@BelongsTo(() => StoreModel)
	store?: StoreModel;
	@BelongsToMany(() => CartModel, () => CartItemModel)
	cart?: CartModel[];

	@BeforeCreate
	@BeforeUpdate
	static formatValues(instance: ProductModel) {
		//add two extra zeros after decimal point
		if (typeof instance.price === "number") {
			instance.price = Number(instance.price.toFixed(2));
		}
		if (
			typeof instance.averageRating === "number" &&
			instance.averageRating !== null
		) {
			instance.averageRating = Number(instance.averageRating.toFixed(2));
		}
	}
}
