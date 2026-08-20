import { OrderStatus } from "@prisma/client";
import { Badge } from "@/shared/components/ui";

const mapStatusBadge: Record<
	OrderStatus,
	{ label: string; variant: "warning" | "success" | "destructive" }
> = {
	PENDING: { label: "Ожидает оплаты", variant: "warning" },
	SUCCEEDED: { label: "Оплачен", variant: "success" },
	CANCELLED: { label: "Отменён", variant: "destructive" },
};

export const orderStatusLabels: Record<OrderStatus, string> = {
	PENDING: "Ожидает оплаты",
	SUCCEEDED: "Оплачен",
	CANCELLED: "Отменён",
};

interface Props {
	status: OrderStatus;
}

export const OrderStatusBadge: React.FC<Props> = ({ status }) => {
	const { label, variant } = mapStatusBadge[status];

	return <Badge variant={variant}>{label}</Badge>;
};
