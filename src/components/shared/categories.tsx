import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
	className?: string;
}

const cats = [
	'Пиццы',
	'Комбо',
	'Закуски',
	'Коктейли',
	'Кофе',
	'Напитки',
	'Десерты',
];
const activeIndex = 0;

export const Categories: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'inline-flex flex-row gap-1 bg-white/50 p-1 rounded-2xl',
				className
			)}>
			{cats.map((cat, idx) => (
				<a
					className={cn(
						'flex items-center font-bold h-11 px-5 rounded-2xl',
						activeIndex === idx &&
							'bg-white shadow-md shadow-gray-200 text-primary'
					)}
					key={idx}>
					<button>{cat}</button>
				</a>
			))}
		</div>
	);
};
