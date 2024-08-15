'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/shared/hooks';

import { CheckoutSidebar, Container, Title } from '@/shared/components';
import {
	CheckoutCart,
	CheckoutDeliveryForm,
	CheckoutPersonalForm,
} from '@/shared/components';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/constants';

export default function CheckoutPage() {
	const {
		totalAmount,
		items,
		productNoun,
		updatingItemId,
		loading,
		removeCartItem,
		onClickCountButton,
	} = useCart();

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			address: '',
			phone: '',
			comment: '',
		},
	});

	const onSubmit: SubmitHandler<CheckoutFormValues> = (
		data: CheckoutFormValues
	) => {
		console.log('form data: ', data);
	};

	return (
		<Container className="mt-10">
			<Title
				text="Оформление заказа"
				className="font-extrabold mb-8 text-4xl"
			/>

			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex gap-10">
						<div className="flex flex-col gap-10 flex-1 mb-20">
							<CheckoutCart
								items={items}
								productNoun={productNoun}
								onClickCountButton={onClickCountButton}
								removeCartItem={removeCartItem}
								loading={loading}
								disabledItemId={updatingItemId}
							/>

							<CheckoutPersonalForm
								className={loading ? 'opacity-40 pointer-events-none' : ''}
							/>

							<CheckoutDeliveryForm
								className={loading ? 'opacity-40 pointer-events-none' : ''}
							/>
						</div>

						<div className="w-[450px]">
							<CheckoutSidebar
								totalAmount={totalAmount}
								loading={loading}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Container>
	);
}
