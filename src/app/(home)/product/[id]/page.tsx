import {
	Container,
	PizzaForm,
	PizzaImage,
	ProductForm,
	ProductOrPizzaForm,
	ProductVariants,
	Title,
} from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import React from 'react';
import { useCartStore } from '@/shared/store';
import toast from 'react-hot-toast';

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await prisma.product.findFirst({
		where: {
			id: Number(id),
		},
		include: {
			ingredients: true,
			category: {
				include: {
					products: {
						include: {
							items: true,
						},
					},
				},
			},
			items: true,
		},
	});

	if (!product) {
		return notFound();
	}

	return (
		<Container className="flex flex-col my-10">
			<ProductOrPizzaForm
				product={product}
				className="rounded-lg"
			/>
		</Container>
	);
}
