import { ProductItem, Ingredient } from '@prisma/client';

type Item = {
	productItem: ProductItem;
	ingredients: Ingredient[];
	quantity: number;
};

export const calcCartTotalAmount = (item: Item): number => {
	const ingredientPrice = item.ingredients.reduce(
		(acc, ingredient) => acc + ingredient.price,
		0
	);

	return (ingredientPrice + item.productItem.price) * item.quantity;
};
