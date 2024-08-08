'use client';

import { ProductExtends } from '@/@types/prisma';
import { PizzaForm, ProductForm } from '@/shared/components/shared';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { useCartStore } from '@/shared/store';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import async from '../../../../app/(home)/@modal/(.)product/[id]/page';

interface Props {
	product: ProductExtends;
	className?: string;
}

export const ModalProduct: React.FC<Props> = ({ product, className }) => {
	const router = useRouter();
	const firstItem = product.items[0];
	const isPizzaForm = Boolean(firstItem.pizzaType);
	const [addCartItem, loading] = useCartStore((state) => [
		state.addCartItem,
		state.loading,
	]);

	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id;

			await addCartItem({
				productItemId: itemId,
				ingredients,
			});
			toast.success(
				`${isPizzaForm ? 'Пицца добавлена' : 'Продукт добавлен'}  в корзину`
			);
			router.back();
		} catch (error) {
			toast.error(
				`Не удалось добавить ${isPizzaForm ? 'пиццу' : 'продукт'} в корзину`
			);
			console.log('Exception ' + error);
		}
	};

	return (
		<Dialog
			open={Boolean(product)}
			onOpenChange={() => router.back()}>
			<DialogContent
				className={cn(
					'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
					className
				)}>
				{isPizzaForm ? (
					<PizzaForm
						imageUrl={product.imageUrl}
						name={product.name}
						ingredients={product.ingredients}
						items={product.items}
						onSubmit={onSubmit}
						loading={loading}
					/>
				) : (
					<ProductForm
						imageUrl={product.imageUrl}
						name={product.name}
						onSubmit={onSubmit}
						price={firstItem.price}
						loading={loading}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
