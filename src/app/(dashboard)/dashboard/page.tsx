import Link from "next/link";
import {
	BadgeDollarSign,
	ShoppingBag,
	Users,
	Receipt,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { StatCard, OrderStatusBadge } from "@/shared/components/dashboard";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui";

export default async function DashboardPage() {
	const [
		totalRevenue,
		ordersCount,
		usersCount,
		statusCounts,
		latestOrders,
		topProducts,
	] = await Promise.all([
		prisma.order.aggregate({
			_sum: { totalAmount: true },
			where: { status: OrderStatus.SUCCEEDED },
		}),
		prisma.order.count(),
		prisma.user.count(),
		prisma.order.groupBy({
			by: ["status"],
			_count: { id: true },
		}),
		prisma.order.findMany({
			take: 7,
			orderBy: { createdAt: "desc" },
		}),
		prisma.cartItem.groupBy({
			by: ["productItemId"],
			_sum: { quantity: true },
		}),
	]);

	const revenue = totalRevenue._sum.totalAmount ?? 0;
	const averageCheck = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;
	const statusMap = Object.fromEntries(
		statusCounts.map(({ status, _count }) => [status, _count.id]),
	);

	const topProductItems = await prisma.productItem.findMany({
		where: {
			id: { in: topProducts.map((item) => item.productItemId) },
		},
		include: { product: { select: { name: true, imageUrl: true } } },
	});

	const topSold = topProducts
		.map((item) => ({
			product: topProductItems.find(
				({ id }) => id === item.productItemId,
			)?.product,
			sold: item._sum.quantity ?? 0,
		}))
		.filter(({ product }) => product)
		.sort((a, b) => b.sold - a.sold)
		.slice(0, 5);

	return (
		<div className="space-y-8">
			<div>
				<Title size="lg" text="Обзор" />
				<p className="mt-1 text-muted-foreground">
					Ключевые показатели магазина
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Выручка"
					value={`${revenue.toLocaleString("ru-RU")} ₽`}
					hint="по оплаченным заказам"
					icon={<BadgeDollarSign className="h-7 w-7" />}
					variant="revenue"
				/>
				<StatCard
					title="Заказы"
					value={ordersCount.toLocaleString("ru-RU")}
					hint={`ожидают оплаты: ${statusMap[OrderStatus.PENDING] ?? 0}`}
					icon={<ShoppingBag className="h-7 w-7" />}
					variant="orders"
				/>
				<StatCard
					title="Пользователи"
					value={usersCount.toLocaleString("ru-RU")}
					icon={<Users className="h-7 w-7" />}
					variant="users"
				/>
				<StatCard
					title="Средний чек"
					value={`${averageCheck.toLocaleString("ru-RU")} ₽`}
					icon={<Receipt className="h-7 w-7" />}
					variant="average"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="space-y-6 xl:col-span-2">
					<div className="rounded-xl border bg-white shadow-sm">
						<div className="flex items-center justify-between border-b px-6 py-4">
							<h2 className="font-bold">Последние заказы</h2>
							<Link
								href="/dashboard/orders"
								className="text-sm font-medium text-primary hover:underline">
								Все заказы →
							</Link>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Заказ</TableHead>
									<TableHead>Клиент</TableHead>
									<TableHead>Сумма</TableHead>
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{latestOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">
											#{order.id}
										</TableCell>
										<TableCell>{order.fullName}</TableCell>
										<TableCell>
											{order.totalAmount.toLocaleString("ru-RU")} ₽
										</TableCell>
										<TableCell>
											<OrderStatusBadge status={order.status} />
										</TableCell>
									</TableRow>
								))}
								{latestOrders.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-muted-foreground">
											Заказов пока нет
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				<div className="space-y-6">
					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-bold">Заказы по статусам</h2>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<OrderStatusBadge status={OrderStatus.PENDING} />
								<span className="font-semibold">
									{statusMap[OrderStatus.PENDING] ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<OrderStatusBadge status={OrderStatus.SUCCEEDED} />
								<span className="font-semibold">
									{statusMap[OrderStatus.SUCCEEDED] ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<OrderStatusBadge status={OrderStatus.CANCELLED} />
								<span className="font-semibold">
									{statusMap[OrderStatus.CANCELLED] ?? 0}
								</span>
							</div>
						</div>
					</div>

					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-bold">Топ-5 товаров по продажам</h2>
						<div className="space-y-3">
							{topSold.map(({ product, sold }, index) => (
								<div key={product!.name + index} className="flex items-center gap-3">
									<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
										{index + 1}
									</span>
									<p className="flex-1 truncate text-sm">
										{product!.name}
									</p>
									<span className="text-sm font-semibold text-muted-foreground">
										{sold} шт.
									</span>
								</div>
							))}
							{topSold.length === 0 && (
								<p className="text-sm text-muted-foreground">
									Продаж пока нет
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
