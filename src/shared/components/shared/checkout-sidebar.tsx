import { CheckoutItemDetails, WhiteBlock } from '@/shared/components/shared';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import React from 'react';

const TAX = 5;
const DELIVERY_PRICE = 250;

interface Props {
	totalAmount: number;
	className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
	totalAmount,
	className,
}) => {
	const taxPrice = (totalAmount * TAX) / 100;
	const totalPrice = totalAmount + taxPrice + DELIVERY_PRICE;

	return (
		<WhiteBlock className={(cn('p-6 sticky top-4'), className)}>
			<div className="flex flex-col gap-1">
				<span className="text-xl">Итого:</span>
				<span className="text-3xl font-extrabold">{totalPrice} ₽</span>
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
				price={totalAmount}
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
				price={taxPrice}
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
				price={DELIVERY_PRICE}
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
