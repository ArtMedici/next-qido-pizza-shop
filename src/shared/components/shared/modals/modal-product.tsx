'use client';

import { ProductExtends } from '@/@types/prisma';
import { ProductOrPizzaForm } from '@/shared/components/shared';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
	product: ProductExtends;
	className?: string;
}

export const ModalProduct: React.FC<Props> = ({ product, className }) => {
	const router = useRouter();

	return (
		<Dialog
			open={Boolean(product)}
			onOpenChange={() => router.back()}>
			<DialogContent
				className={cn(
					'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
					className
				)}>
				<ProductOrPizzaForm
					product={product}
					onSubmit={() => router.back()}
				/>
			</DialogContent>
		</Dialog>
	);
};
