"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui";
import { CartItemDTO } from "@/services/dto/cart.dto";
import { OrderStatusBadge } from "@/shared/components/dashboard";
import { OrderStatus } from "@prisma/client";

interface Props {
	order: {
		id: number;
		fullName: string;
		email: string;
		phone: string;
		address: string;
		comment: string | null;
		totalAmount: number;
		status: OrderStatus;
		items: string | null;
		createdAt: Date | string;
	};
	children: React.ReactNode;
}

export const OrderDetailsDialog: React.FC<Props> = ({ order, children }) => {
	let items: CartItemDTO[] = [];
	let parseError = false;

	try {
		if (order.items) {
			const raw = order.items as unknown;
			items =
				typeof raw === "string"
					? JSON.parse(raw)
					: (raw as unknown as CartItemDTO[]);
		}
	} catch {
		parseError = true;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-lg bg-white">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-3">
						Заказ #{order.id}
						<OrderStatusBadge status={order.status} />
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div>
							<p className="text-muted-foreground">Клиент</p>
							<p className="font-medium">{order.fullName}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Телефон</p>
							<p className="font-medium">{order.phone}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Email</p>
							<p className="font-medium break-all">{order.email}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Дата заказа</p>
							<p className="font-medium">
								{new Date(order.createdAt).toLocaleString("ru-RU")}
							</p>
						</div>
						<div className="col-span-2">
							<p className="text-muted-foreground">Адрес доставки</p>
							<p className="font-medium">{order.address}</p>
						</div>
						{order.comment && (
							<div className="col-span-2">
								<p className="text-muted-foreground">Комментарий</p>
								<p className="font-medium">{order.comment}</p>
							</div>
						)}
					</div>

					<div className="rounded-lg border p-4">
						<p className="mb-2 text-sm font-semibold">Состав заказа</p>
						{parseError ? (
							<p className="text-sm text-muted-foreground">
								Состав заказа недоступен
							</p>
						) : (
							<ul className="max-h-56 space-y-2 overflow-y-auto scrollbar pr-1">
								{items.map((item) => (
									<li
										key={item.id}
										className="flex items-center justify-between gap-2 text-sm">
										<span className="flex-1 truncate">
											{item.productItem.product.name}
											{item.ingredients.length > 0 && (
												<span className="text-muted-foreground text-wrap">
													{" "}
													+ {item.ingredients.map((i) => i.name).join(", ")}
												</span>
											)}
										</span>
										<span className="shrink-0 text-muted-foreground">
											{item.quantity} × {item.productItem.price} ₽
										</span>
									</li>
								))}
							</ul>
						)}
						<div className="mt-3 flex justify-between border-t pt-3 text-sm font-bold">
							<span>Итого</span>
							<span>{order.totalAmount.toLocaleString("ru-RU")} ₽</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
