'use client';

import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import React from 'react';

interface Props {
	className?: string;
}

type Category = {
	id: number;
	name: string;
};

const categories: Category[] = [
	{ id: 1, name: 'Пиццы' },
	{ id: 2, name: 'Комбо' },
	{ id: 3, name: 'Закуски' },
	{ id: 4, name: 'Коктейли' },
	{ id: 5, name: 'Кофе' },
	{ id: 6, name: 'Напитки' },
	{ id: 7, name: 'Десерты' },
];

export const Categories: React.FC<Props> = ({ className }) => {
	const categoryActiveId = useCategoryStore((state) => state.activeId);

	return (
		<div
			className={cn(
				'inline-flex flex-row gap-1 bg-white/50 p-1 rounded-2xl',
				className
			)}>
			{categories.map(({ name, id }, idx) => (
				<a
					className={cn(
						'flex items-center font-bold h-11 px-5 rounded-2xl',
						categoryActiveId === id &&
							'bg-white shadow-md shadow-gray-200 text-primary'
					)}
					href={`/#${name}`}
					key={idx}>
					<button>{name}</button>
				</a>
			))}
		</div>
	);
};
