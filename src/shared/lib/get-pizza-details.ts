import { PizzaType, PizzaSize, mapPizzaType } from '@/shared/constants/pizza';
import { calcPrice } from '@/shared/lib/calc-price';
import { ProductItem, Ingredient } from '@prisma/client';

export const getPizzaDetails = (
	type: PizzaType,
	size: PizzaSize,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>
) => {
	const totalPrice = calcPrice(
		type,
		size,
		items,
		ingredients,
		selectedIngredients
	);

	const textDetails = `${size} см, ${mapPizzaType[type].toLowerCase()} тесто ${size}`;

	return { totalPrice, textDetails };
};
