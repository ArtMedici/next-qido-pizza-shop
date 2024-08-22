import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getOrderStatus } from '@/app/actions';
import { OrderStatus } from '@prisma/client';

export type ReturnProps = {
	orderStatus: OrderStatus;
};

export const useOrderStatus = (): ReturnProps => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [orderStatus, setOrderStatus] = React.useState<OrderStatus>(
			OrderStatus.PENDING,
	);
	
	React.useEffect(() => {
		const fetchOrderStatus = async () => {
			if (searchParams.has('paid')) {
				try {
					const paymentStatus = await getOrderStatus();
					
					if (paymentStatus === OrderStatus.SUCCEEDED) {
						setOrderStatus(OrderStatus.SUCCEEDED);
						setTimeout(() => {
							toast.success('Заказ успешно оплачен! Чек отправлен на почту', {
								duration: 6000,
							});
						}, 500);
						
						router.replace('/');
					} else if (paymentStatus === OrderStatus.CANCELLED) {
						setOrderStatus(OrderStatus.CANCELLED);
						setTimeout(() => {
							toast.error('Заказ был отменен', {
								duration: 6000,
							});
						}, 500);
						
						router.replace('/');
					} else if (paymentStatus === OrderStatus.PENDING) {
						setOrderStatus(OrderStatus.PENDING);
						setTimeout(() => {
							toast.loading('Заказ ожидает оплаты...', {
								duration: 6000,
							});
						}, 500);
						
						setTimeout(() => {
							toast.dismiss();
						}, 6000);
						
						router.replace('/');
					} else {
						router.replace('/');
					}
				} catch (error) {
					console.error('Ошибка получения статуса заказа: ', error);
					
					router.replace('/');
				}
			}
		};
		
		fetchOrderStatus();
	}, [searchParams, router]);
	
	return { orderStatus };
};
