import { prisma } from '@/prisma/prisma-client';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { Cart, CartItem, Ingredient } from '@prisma/client';

export const getCartItemByIngredients = async (
	userCart: Cart,
	data: CreateCartItemValues
): Promise<CartItem | undefined> => {
	const CartItemsVariants = await prisma.cartItem.findMany({
		where: {
			cartId: userCart.id,
			productItemId: data.productItemId,
		},
		include: {
			ingredients: true,
		},
	});

	if (!data.ingredients) {
		return CartItemsVariants[0];
	}

	const searchProductByIngredients = (
		firstItemsIngredients: Ingredient[],
		secondItemsIngredients: number[]
	) => {
		const firstIngredientsIds = firstItemsIngredients
			.map((ing) => ing.id)
			.sort();
		const secondIngredientsIds = secondItemsIngredients.sort();
		return (
			JSON.stringify(firstIngredientsIds) ===
			JSON.stringify(secondIngredientsIds)
		);
	};

	return CartItemsVariants.find((item) =>
		searchProductByIngredients(item.ingredients, data.ingredients!)
	);
};
