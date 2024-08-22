'use server';

import { CheckoutFormValues } from '@/shared/constants';
import { prisma } from '@/prisma/prisma-client';
import { cookies } from 'next/headers';
import { calcOrderPrice, createPayment, sendEmail } from '@/shared/lib';
import { PayOrderTemplate } from '@/shared/components';
import { OrderStatus } from '@prisma/client';

export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookieStore = cookies();
		const cartToken = cookieStore.get('cartToken')?.value;
		
		if (!cartToken) {
			throw new Error('Cart token not found');
		}
		
		const userCart = await prisma.cart.findFirst({
			include: {
				user: true,
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
			where: {
				token: cartToken,
			},
		});
		
		if (!userCart) {
			throw new Error('Cart not found');
		}
		
		if (userCart?.totalAmount === 0) {
			throw new Error('Cart is empty');
		}
		
		const { totalPrice } = calcOrderPrice(userCart.totalAmount);
		
		const order = await prisma.order.create({
			data: {
				token: cartToken,
				fullName: data.firstName + ' ' + data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				comment: data.comment,
				totalAmount: totalPrice,
				items: JSON.stringify(userCart.items),
			},
		});
		
		await prisma.cart.update({
			where: {
				id: userCart.id,
			},
			data: {
				totalAmount: 0,
			},
		});
		
		await prisma.cartItem.deleteMany({
			where: {
				cartId: userCart.id,
			},
		});
		
		const paymentData = await createPayment({
			orderId: order.id,
			amount: order.totalAmount,
			description: 'Оплата заказа #' + order.id,
		});
		
		if (!paymentData) {
			throw new Error('Payment data not found');
		}
		
		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				paymentId: paymentData.id,
			},
		});
		
		const paymentUrl = paymentData.confirmation.confirmation_url;
		const paymentId = paymentData.id;
		
		if (!paymentUrl) {
			throw new Error('Payment url not found');
		}
		
		if (!paymentId) {
			throw new Error('Payment id not found');
		}
		
		cookieStore.set('paymentToken', paymentId);
		
		await sendEmail(
				data.email,
				'QIDO Пицца | Оплата заказа #' + order.id,
				PayOrderTemplate({
					orderId: order.id,
					totalAmount: order.totalAmount,
					paymentUrl,
				}),
		);
		
		return paymentUrl;
	} catch (err) {
		console.log('[CreateOrder] Server error: ', err);
	}
}

export async function getOrderStatus() {
	try {
		const cookieStore = cookies();
		const cartToken = cookieStore.get('cartToken')?.value;
		const paymentToken = cookieStore.get('paymentToken')?.value;
		
		if (!paymentToken) {
			throw new Error('Payment token not found');
		}
		
		const order = await prisma.order.findFirst({
			where: {
				token: cartToken,
				paymentId: paymentToken,
			},
		});
		
		if (!order) {
			throw new Error('Order not found');
		}
		
		if (
				order.status === OrderStatus.SUCCEEDED ||
				order.status === OrderStatus.CANCELLED
		) {
			cookieStore.delete('paymentToken');
		}
		
		return order.status;
	} catch (err) {
		console.log('[GetOrderStatus] Server error: ', err);
	}
}
