import {
	Table,
	Column,
	Model,
	Default,
	BelongsTo,
	Index,
	DataType,
	ForeignKey,
	BeforeCreate,
	BeforeUpdate,
} from "sequelize-typescript";

import { ProductModel, Users } from ".";

export interface ReviewAttributes {
	reviewId?: string;
	comment?: string | null;
	rating?: number;
	reviewedBy?: Users;
	userId?: string;
	product?: ProductModel;
	productId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ tableName: "Review", timestamps: true })
export class ReviewModel
	extends Model<ReviewAttributes, ReviewAttributes>
	implements ReviewAttributes
{
	@Default(DataType.UUIDV4)
	@Index({ name: "review_id_index", unique: true, using: "BTREE" })
	@Column({
		field: "reviewId",
		primaryKey: true,
		type: DataType.UUID,
		unique: true,
	})
	reviewId?: string;
	@Default(null)
	@Column({ field: "comment", allowNull: true, type: DataType.STRING(1000) })
	comment?: string | null;
	@Default(0.0)
	@Column({ field: "rating", allowNull: true, type: DataType.DECIMAL(3, 2) })
	rating?: number;
	@ForeignKey(() => ProductModel)
	@Column({ field: "productId", allowNull: true, type: DataType.UUID })
	productId?: string;
	@BelongsTo(() => ProductModel, { constraints: false })
	product?: ProductModel;
	@ForeignKey(() => Users)
	@Column({ field: "userId", allowNull: true, type: DataType.UUID })
	userId?: string;
	@BelongsTo(() => Users, { constraints: false })
	reviewedBy?: Users;

	@BeforeCreate
	@BeforeUpdate
	static formatValues(instance: ReviewModel) {
		//add two extra zeros after decimal point
		if (instance.rating !== undefined && instance.rating !== null) {
			instance.rating = Number(instance.rating.toFixed(2));
		}
	}
}
