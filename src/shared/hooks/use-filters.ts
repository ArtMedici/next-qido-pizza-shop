import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useSet } from 'react-use';

interface PriceRangeProps {
	priceFrom?: number;
	priceTo?: number;
}

interface QueryFilters extends PriceRangeProps {
	pizzaTypes: string;
	sizes: string;
	ingredients: string;
}

export interface Filters {
	sizes: Set<string>;
	pizzaTypes: Set<string>;
	selectedIngredients: Set<string>;
	priceRange: PriceRangeProps;
}

interface ReturnProps extends Filters {
	setPriceRange: (name: keyof PriceRangeProps, value: number) => void;
	setPizzaTypes: (value: string) => void;
	setSizes: (value: string) => void;
	setSelectedIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
	const searchParams = useSearchParams() as unknown as Map<
		keyof QueryFilters,
		string
	>;

	const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
		new Set<string>(searchParams.get('ingredients')?.split(','))
	);

	const [sizes, { toggle: toggleSizes }] = useSet(
		new Set<string>(searchParams.get('sizes')?.split(',') || [])
	);

	const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
		new Set<string>(searchParams.get('pizzaTypes')?.split(',') || [])
	);

	const [priceRange, setPriceRange] = React.useState<PriceRangeProps>({
		priceFrom: Number(searchParams.get('priceFrom')) || undefined,
		priceTo: Number(searchParams.get('priceTo')) || undefined,
	});

	const updatePriceRange = (name: keyof PriceRangeProps, value: number) => {
		setPriceRange((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return {
		sizes,
		pizzaTypes,
		selectedIngredients,
		priceRange,
		setPriceRange: updatePriceRange,
		setPizzaTypes: togglePizzaTypes,
		setSizes: toggleSizes,
		setSelectedIngredients: toggleIngredients,
	};
};
