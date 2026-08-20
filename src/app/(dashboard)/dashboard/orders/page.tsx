import { OrderStatus } from "@prisma/client";
import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { orderStatusLabels } from "@/shared/components/dashboard";
import { OrdersTable, type OrderRow } from "./orders-table";

export default async function OrdersPage() {
	const orders = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
	});

	const rows: OrderRow[] = orders.map((order) => ({
		id: order.id,
		fullName: order.fullName,
		email: order.email,
		phone: order.phone,
		totalAmount: order.totalAmount,
		status: order.status,
		createdAt: order.createdAt.toISOString(),
		comment: order.comment,
		address: order.address,
		items: order.items as unknown as string | null,
	}));

	return (
		<div className="space-y-6">
			<div>
				<Title size="lg" text="Заказы" />
				<p className="mt-1 text-muted-foreground">
					Управление заказами и их статусами
				</p>
			</div>

			<OrdersTable orders={rows} />
		</div>
	);
}
