'use client';

import { Input } from '@/components/ui';
import { CheckboxFiltersGroup, RangeSlider, Title } from '@/components/shared';
import React from 'react';
import { useIngredients, useFilters, useQueryFilters } from '@/hooks';

interface Props {
	className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
	const { ingredients, loading } = useIngredients();
	const filters = useFilters();

	useQueryFilters(filters);

	const items = ingredients.map((item) => ({
		value: String(item.id),
		text: item.name,
	}));

	const updatePriceRange = (priceRange: number[]) => {
		filters.setPriceRange('priceFrom', priceRange[0]);
		filters.setPriceRange('priceTo', priceRange[1]);
	};

	return (
		<div className={className}>
			<Title
				text="Фильтрация"
				size="sm"
				className="mb-5 font-bold"
			/>

			<CheckboxFiltersGroup
				title="Тип теста"
				name="pizzaTypes"
				className="mb-5"
				onClickCheckbox={filters.setPizzaTypes}
				selected={filters.pizzaTypes}
				items={[
					{ text: 'Тонкое', value: '1' },
					{ text: 'Традиционное', value: '2' },
				]}
			/>

			<CheckboxFiltersGroup
				name="sizes"
				className="mb-5"
				title="Размер пиццы"
				onClickCheckbox={filters.setSizes}
				selected={filters.sizes}
				items={[
					{ text: '25 см', value: '25' },
					{ text: '30 см', value: '30' },
					{ text: '35 см', value: '35' },
				]}
			/>

			<div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
				<p className="font-bold mb-3">Цена от и до:</p>
				<div className="flex gap-3 mb-5">
					<Input
						type="number"
						placeholder="0"
						min={0}
						max={1500}
						value={String(filters.priceRange.priceFrom)}
						onChange={(e) =>
							filters.setPriceRange('priceFrom', Number(e.target.value))
						}
					/>
					<Input
						type="number"
						placeholder="1000"
						min={100}
						max={1500}
						value={String(filters.priceRange.priceTo)}
						onChange={(e) =>
							filters.setPriceRange('priceTo', Number(e.target.value))
						}
					/>
				</div>

				<RangeSlider
					min={0}
					max={1500}
					step={10}
					value={[
						filters.priceRange.priceFrom || 0,
						filters.priceRange.priceTo || 1500,
					]}
					onValueChange={updatePriceRange}
				/>
			</div>

			<CheckboxFiltersGroup
				title="Ингредиенты"
				name="ingredients"
				className="mt-5"
				limit={6}
				items={items}
				loading={loading}
				onClickCheckbox={filters.setSelectedIngredients}
				selected={filters.selectedIngredients}
			/>
		</div>
	);
};
