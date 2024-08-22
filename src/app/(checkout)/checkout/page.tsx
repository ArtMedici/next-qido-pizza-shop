'use client';

import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/shared/hooks';

import {
	CheckoutCart,
	CheckoutDeliveryForm,
	CheckoutPersonalForm,
	CheckoutSidebar,
	Container,
	Title,
} from '@/shared/components';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/constants';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

export default function CheckoutPage() {
	const [submitting, setSubmitting] = React.useState(false);
	const {
		totalAmount,
		items,
		productNoun,
		updatingItemId,
		loading,
		removeCartItem,
		onClickCountButton,
	} = useCart();
	
	if (items.length === 0 || totalAmount === 0) redirect('/');
	
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
	
	const onSubmit: SubmitHandler<CheckoutFormValues> = async (
			data: CheckoutFormValues,
	) => {
		try {
			setSubmitting(true);
			
			const paymentUrl = await createOrder(data);
			
			toast.success('Переход к оплате заказа...', {
				icon: '✅',
			});
			
			if (paymentUrl) {
				location.href = paymentUrl;
			}
		} catch (err) {
			console.log(err);
			
			setSubmitting(false);
			toast.error('Не удалось создать заказ', {
				icon: '❌',
			});
		}
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
										loading={loading || submitting}
								/>
							</div>
						</div>
					</form>
				</FormProvider>
			</Container>
	);
}
