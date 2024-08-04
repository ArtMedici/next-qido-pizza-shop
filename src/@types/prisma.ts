import { Product, ProductItem, Ingredient } from '@prisma/client';

export type ProductExtends = Product & {
	items: ProductItem[];
	ingredients: Ingredient[];
};
