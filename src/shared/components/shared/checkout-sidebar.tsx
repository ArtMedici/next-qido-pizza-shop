import { CheckoutItemDetails, WhiteBlock } from '@/shared/components/shared';
import { Button, Skeleton } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import React from 'react';

const TAX = 5;
const DELIVERY_PRICE = 250;

interface Props {
	totalAmount: number;
	loading?: boolean;
	className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
	totalAmount,
	loading,
	className,
}) => {
	const taxPrice = (totalAmount * TAX) / 100;
	const totalPrice = totalAmount + taxPrice + DELIVERY_PRICE;

	return (
		<WhiteBlock className={(cn('p-6 sticky top-4'), className)}>
			<div className="flex flex-col gap-1">
				<span className="text-xl">Итого:</span>
				{loading ? (
					<Skeleton className="h-11 w-48" />
				) : (
					<span className="h-11 text-3xl font-extrabold">{totalPrice} ₽</span>
				)}
			</div>

			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Package
							size={18}
							className="mr-2 text-gray-400"
						/>
						Стоимость корзины:
					</div>
				}
				price={
					loading ? (
						<Skeleton className="h-7 w-16 rounded-[8px]" />
					) : (
						`${totalAmount} ₽`
					)
				}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Percent
							size={18}
							className="mr-2 text-gray-400"
						/>
						Налог:
					</div>
				}
				price={
					loading ? (
						<Skeleton className="h-7 w-16 rounded-[8px]" />
					) : (
						`${taxPrice} ₽`
					)
				}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Truck
							size={18}
							className="mr-2 text-gray-400"
						/>
						Доставка:
					</div>
				}
				price={
					loading ? (
						<Skeleton className="h-7 w-16 rounded-[8px]" />
					) : (
						`${DELIVERY_PRICE} ₽`
					)
				}
			/>

			<Button
				type="submit"
				className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
				Перейти к оплате
				<ArrowRight className="w-5 ml-2" />
			</Button>
		</WhiteBlock>
	);
};
