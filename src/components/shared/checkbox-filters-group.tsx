'use client';

import {
	FilterCheckbox,
	FilterCheckboxProps,
} from '@/components/shared/filter-checkbox';
import { Input, Skeleton } from '@/components/ui';
import React from 'react';

type Item = FilterCheckboxProps;

interface Props {
	title: string;
	items: Item[];
	limit?: number;
	loading?: boolean;
	searchInputPlaceholder?: string;
	onClickCheckbox?: (id: string) => void;
	defaultValue?: string[];
	selected?: Set<string>;
	className?: string;
	name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
	title,
	items,
	limit = 5,
	loading,
	searchInputPlaceholder = 'Поиск...',
	onClickCheckbox,
	defaultValue,
	selected,
	className,
	name,
}) => {
	const [limitItems, setLimitItems] = React.useState(limit);
	const [showAll, setShowAll] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState('');

	React.useEffect(() => {
		if (selected && selected.size > limit) {
			setLimitItems(selected?.size);
		}
	}, [selected, limit]);

	const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	if (loading) {
		return (
			<div className={className}>
				<p className="font-bold mb-3">{title}</p>
				{...Array(limitItems)
					.fill(0)
					.map((_, idx) => (
						<Skeleton
							key={idx}
							className="h-6 mb-4 rounded-[8px]"
						/>
					))}
				<Skeleton className="w-28 h-6 mb-4 rounded-[8px]" />
			</div>
		);
	}

	const sortedItems =
		items.length > limitItems
			? items.sort((a, b) => {
					if (selected?.has(a.value) && !selected?.has(b.value)) return -1;
					if (!selected?.has(a.value) && selected?.has(b.value)) return 1;
					return 0;
				})
			: items;

	const list = showAll
		? sortedItems.filter((item) =>
				item.text.toLowerCase().includes(searchValue.toLowerCase())
			)
		: sortedItems.slice(0, limitItems);

	return (
		<div className={className}>
			<p className="font-bold mb-3">{title}</p>

			{showAll && (
				<div className="mb-5">
					<Input
						onChange={onChangeSearchInput}
						placeholder={searchInputPlaceholder}
						className="bg-gray-50 border-none"
					/>
				</div>
			)}

			<div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
				{list.map((item, idx) => (
					<FilterCheckbox
						key={idx}
						text={item.text}
						value={item.value}
						endAdornment={item.endAdornment}
						checked={selected?.has(item.value)}
						onCheckedChange={() => onClickCheckbox?.(item.value)}
						name={name}
					/>
				))}
			</div>
			{items.length > limitItems && (
				<div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
					<button
						onClick={() => setShowAll(!showAll)}
						className="text-primary mt-3">
						{showAll ? 'Скрыть' : '+ Показать все'}
					</button>
				</div>
			)}
		</div>
	);
};
