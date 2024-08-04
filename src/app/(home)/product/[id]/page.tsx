import {
	Container,
	PizzaImage,
	ProductVariants,
	Title,
} from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await prisma.product.findFirst({
		where: {
			id: Number(id),
		},
	});

	if (!product) {
		return notFound();
	}

	return (
		<Container className="flex flex-col my-10">
			<div className="flex flex-1">
				<PizzaImage
					imageUrl={product.imageUrl}
					size={35}
				/>

				<div className="w-[490px] bg-[#f1f1f1] py-7">
					<Title
						text={product.name}
						size="md"
						className="font-extrabold mb-1"
					/>

					<p className="text-gray-400">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit.
					</p>

					<ProductVariants
						value="2"
						items={[
							{
								name: 'Маленькая',
								value: '1',
								disabled: true,
							},
							{
								name: 'Средняя',
								value: '2',
							},
							{
								name: 'Большая',
								value: '3',
							},
						]}
					/>
				</div>
			</div>
		</Container>
	);
}
