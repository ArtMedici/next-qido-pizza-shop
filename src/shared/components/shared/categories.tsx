'use client';

import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store';
import { Category } from '@prisma/client';
import React from 'react';

interface Props {
	items: Category[];
	className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
	const categoryActiveId = useCategoryStore((state) => state.activeId);

	return (
		<div
			className={cn(
				'inline-flex flex-row gap-1 bg-white/50 p-1 rounded-2xl',
				className
			)}>
			{items.map(({ name, id }, idx) => (
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
