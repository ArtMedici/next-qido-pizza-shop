'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { ProductCard, Title } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';

interface Props {
	title: string;
	items: any[];
	className?: string;
	listClassName?: string;
	categoryId: number;
}

export const ProductsGroupList: React.FC<Props> = ({
	title,
	items,
	listClassName,
	categoryId,
	className,
}) => {
	const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
	const intersectionRef = React.useRef(null);
	const intersection = useIntersection(intersectionRef, {
		threshold: 0.4,
	});

	React.useEffect(() => {
		if (intersection?.isIntersecting) {
			setActiveCategoryId(categoryId);
		}
	}, [categoryId, intersection?.isIntersecting, title]);

	return (
		<div
			className={className}
			id={title}>
			<Title
				text={title}
				size="lg"
				className="font-extrabold mb-5"
			/>

			<div
				ref={intersectionRef}
				className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
				{items.map((product, i) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						imageUrl={product.imageUrl}
						price={product.items[0].price}
					/>
				))}
			</div>
		</div>
	);
};
