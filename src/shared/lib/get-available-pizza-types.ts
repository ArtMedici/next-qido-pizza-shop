import { ProductItem } from '@prisma/client';
import { PizzaSize, pizzaTypes } from '@/shared/constants/pizza';
import { Variant } from '@/shared/components/shared/product-variants';

/**
 * Функция возвращает список доступных типов теста для пиццы
 *
 * @param size - размер пиццы
 * @param items - список пицц
 *
 * @returns `Array` список типов теста для пиццы
 */
export const getAvailablePizzaTypes = (
	size: PizzaSize,
	items: ProductItem[]
): Variant[] => {
	const filteredPizzasBySize = items.filter((item) => item.size === size);

	return pizzaTypes.map((item) => ({
		name: item.name,
		value: item.value,
		disabled: !filteredPizzasBySize.some(
			(pizza) => Number(pizza.pizzaType) === Number(item.value)
		),
	}));
};
