export const PRODUCT_CATEGORIES = [
	"Electronics",
	"Home Appliances",
	"Clothing and Accessories",
	"Beauty and Personal Care",
	"Health and Wellness",
	"Sports and Outdoors",
	"Automotive",
	"Construction and Industrial",
	"Furniture and Home Decor",
	"Toys and Games",
	"Books and Stationery",
	"Food and Beverages",
	"Pet Supplies",
	"Baby Products",
	"Arts and Crafts",
	"Garden and Outdoor",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
