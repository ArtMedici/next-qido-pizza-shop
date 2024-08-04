import { PizzaType, PizzaSize } from '@/shared/constants/pizza';
import { Ingredient, ProductItem } from '@prisma/client';

/**
 * Функция расчёта стоимости пиццы
 *
 *
 * @param type - тип теста пиццы
 * @param size - размер пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 *
 * @returns `number` общую стоимость пиццы
 */
export const calcPrice = (
	type: PizzaType,
	size: PizzaSize,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>
) => {
	const pizzaPrice =
		items.find((item) => item.pizzaType === type && item.size === size)
			?.price || 0;

	const totalIngredientsPrice = ingredients
		.filter((ingredient) => selectedIngredients.has(ingredient.id))
		.reduce((acc, ingredient) => acc + ingredient.price, 0);

	return pizzaPrice + totalIngredientsPrice;
};
