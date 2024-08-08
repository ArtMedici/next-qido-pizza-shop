'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

import {
	IngredientItem,
	PizzaImage,
	ProductVariants,
	Title,
} from '@/shared/components/shared';
import { Button } from '@/shared/components/ui';
import { PizzaSize, pizzaSizes, PizzaType } from '@/shared/constants/pizza';
import { cn } from '@/shared/lib/utils';
import { getPizzaDetails } from '@/shared/lib';
import { usePizzaOptions } from '@/shared/hooks';

interface Props {
	imageUrl: string;
	name: string;
	ingredients: Ingredient[];
	items: ProductItem[];
	loading?: boolean;
	onSubmit: (itemId: number, ingredients: number[]) => void;
	className?: string;
}

export const PizzaForm: React.FC<Props> = ({
	name,
	items,
	imageUrl,
	ingredients,
	loading,
	onSubmit,
	className,
}) => {
	const {
		size,
		type,
		selectedIngredients,
		availablePizzaTypes,
		currentItemId,
		setSize,
		setType,
		addIngredient,
	} = usePizzaOptions(items);

	const { totalPrice, textDetails } = getPizzaDetails(
		type,
		size,
		items,
		ingredients,
		selectedIngredients
	);

	const handleClickAddCart = () => {
		if (currentItemId) {
			onSubmit(currentItemId, Array.from(selectedIngredients));
		}
	};

	return (
		<div className={cn(className, 'flex flex-1')}>
			<PizzaImage
				imageUrl={imageUrl}
				size={size}
			/>

			<div className={cn(className, 'w-[490px] bg-[#f1f1f1] p-7')}>
				<Title
					text={name}
					size="md"
					className="font-extrabold mb-1"
				/>

				<p className="text-gray-400">{textDetails}</p>

				<div className="flex flex-col gap-1 mt-5">
					<ProductVariants
						items={pizzaSizes}
						value={String(size)}
						onClick={(value) => setSize(Number(value) as PizzaSize)}
					/>
					<ProductVariants
						items={availablePizzaTypes}
						value={String(type)}
						onClick={(value) => setType(Number(value) as PizzaType)}
					/>
				</div>

				<div className="bg-gray-50 mt-5 p-5 rounded-md h-[420px] overflow-auto scrollbar">
					<div className="grid grid-cols-3 gap-3">
						{ingredients.map((ingredient) => (
							<IngredientItem
								key={ingredient.id}
								name={ingredient.name}
								price={ingredient.price}
								imageUrl={ingredient.imageUrl}
								onClick={() => addIngredient(ingredient.id)}
								active={selectedIngredients.has(ingredient.id)}
							/>
						))}
					</div>
				</div>

				<Button
					loading={loading}
					onClick={handleClickAddCart}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice} ₽
				</Button>
			</div>
		</div>
	);
};
