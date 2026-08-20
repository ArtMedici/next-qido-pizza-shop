"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { OrderStatus } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui";
import { orderStatusLabels } from "@/shared/components/dashboard";
import { updateOrderStatus } from "@/app/(dashboard)/actions";

interface Props {
	orderId: number;
	status: OrderStatus;
}

export const OrderStatusSelect: React.FC<Props> = ({ orderId, status }) => {
	const [value, setValue] = useState(status);
	const [isPending, startTransition] = useTransition();

	const handleChange = (next: OrderStatus) => {
		setValue(next);
		startTransition(async () => {
			const res = await updateOrderStatus(orderId, next);
			if (res?.success) {
				toast.success(`Заказ #${orderId}: статус обновлён`);
			} else {
				setValue(status);
				toast.error(res?.error ?? "Не удалось обновить статус");
			}
		});
	};

	return (
		<Select value={value} onValueChange={(v) => handleChange(v as OrderStatus)}>
			<SelectTrigger className="h-9 w-[160px]" disabled={isPending}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(orderStatusLabels).map(([key, label]) => (
					<SelectItem key={key} value={key}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
