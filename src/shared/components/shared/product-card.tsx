import { Title } from '@/shared/components/shared';
import { Button } from '@/shared/components/ui';
import { Ingredient } from '@prisma/client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
	ingredients: Ingredient[];
	className?: string;
}

export const ProductCard: React.FC<Props> = ({
	id,
	name,
	price,
	imageUrl,
	ingredients,
	className,
}) => {
	return (
		<div className={className}>
			<Link
				href={`/product/${id}`}
				scroll={false}>
				<div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
					<img
						className="w-[215px] h-[215px]"
						src={imageUrl}
						alt={name}
					/>
				</div>

				<Title
					text={name}
					size="sm"
					className="mb-1 mt-3 font-bold"
				/>

				{ingredients.length > 0 && (
					<p className="text-sm text-gray-400 line-clamp-3">
						{ingredients.map((ingredient) => ingredient.name).join(', ')}
					</p>
				)}

				<div className="flex justify-between items-center mt-4">
					<span className="text-[20px]">
						от <b>{price} ₽</b>
					</span>

					<Button
						variant="secondary"
						className="text-base font-bold">
						<Plus
							size={20}
							className="mr-1"
						/>
						Добавить
					</Button>
				</div>
			</Link>
		</div>
	);
};
