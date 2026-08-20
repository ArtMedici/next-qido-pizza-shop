"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/shared/components/ui";
import {
	DataTable,
	DateRangeFilter,
	NumberRangeFilter,
	OrderDetailsDialog,
	OrderStatusSelect,
	SelectColumnFilter,
	orderStatusLabels,
	dateRangeFilter,
	includesStringGlobalFilter,
	numberRangeFilter,
	type DateFilterRange,
	type NumberFilterRange,
} from "@/shared/components/dashboard";

export interface OrderRow {
	id: number;
	fullName: string;
	email: string;
	phone: string;
	totalAmount: number;
	status: OrderStatus;
	createdAt: string;
	comment: string | null;
	address: string;
	items: string | null;
}

const columnHelper = createColumnHelper<OrderRow>();

export const OrdersTable: React.FC<{ orders: OrderRow[] }> = ({ orders }) => {
	const columns = React.useMemo(
		() => [
			columnHelper.accessor("id", {
				id: "id",
				header: "Заказ",
				cell: (info) => (
					<span className="font-medium">#{info.getValue()}</span>
				),
			}),
			columnHelper.accessor("fullName", {
				id: "fullName",
				header: "Клиент",
				cell: (info) => (
					<div>
						<p>{info.getValue()}</p>
						<p className="break-all text-xs text-muted-foreground">
							{info.row.original.email}
						</p>
					</div>
				),
			}),
			columnHelper.accessor("phone", {
				id: "phone",
				header: "Телефон",
			}),
			columnHelper.accessor("totalAmount", {
				id: "totalAmount",
				header: "Сумма",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="font-semibold">
						{info.getValue().toLocaleString("ru-RU")} ₽
					</span>
				),
				filterFn: numberRangeFilter,
			}),
			columnHelper.accessor("createdAt", {
				id: "createdAt",
				header: "Дата",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="text-muted-foreground">
						{new Date(info.getValue()).toLocaleString("ru-RU")}
					</span>
				),
				filterFn: dateRangeFilter,
			}),
			columnHelper.accessor("status", {
				id: "status",
				header: "Статус",
				enableGlobalFilter: false,
				cell: (info) => (
					<OrderStatusSelect
						orderId={info.row.original.id}
						status={info.getValue()}
					/>
				),
				enableSorting: false,
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<OrderDetailsDialog order={row.original}>
						<Button variant="outline" size="sm">
							Детали
						</Button>
					</OrderDetailsDialog>
				),
				enableSorting: false,
			}),
		],
		[],
	);

	return (
		<DataTable
			data={orders}
			columns={columns}
			globalFilterFn={includesStringGlobalFilter}
			searchPlaceholder="Поиск: № заказа, email, телефон"
			emptyMessage="Заказы не найдены"
			renderFilters={(table) => {
				const statusValue = table.getColumn("status")?.getFilterValue() as
					| string
					| undefined;
				const dateValue = table.getColumn("createdAt")?.getFilterValue() as
					| DateFilterRange
					| undefined;
				const amountValue = table.getColumn("totalAmount")?.getFilterValue() as
					| NumberFilterRange
					| undefined;

				return (
					<>
						<SelectColumnFilter
							value={statusValue}
							onChange={(value) =>
								table.getColumn("status")?.setFilterValue(value)
							}
							allLabel="Все статусы"
							options={Object.entries(orderStatusLabels).map(
								([value, label]) => ({ value, label }),
							)}
						/>
						<DateRangeFilter
							label="Дата заказа"
							value={dateValue}
							onChange={(value) =>
								table.getColumn("createdAt")?.setFilterValue(value)
							}
						/>
						<NumberRangeFilter
							label="Сумма, ₽"
							value={amountValue}
							onChange={(value) =>
								table.getColumn("totalAmount")?.setFilterValue(value)
							}
						/>
					</>
				);
			}}
		/>
	);
};
