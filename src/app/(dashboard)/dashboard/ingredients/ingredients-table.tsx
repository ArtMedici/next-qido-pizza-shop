"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui";
import {
	AddIngredientButton,
	DataTable,
	DeleteButton,
	IngredientFormDialog,
	NumberRangeFilter,
	includesStringGlobalFilter,
	numberRangeFilter,
	type NumberFilterRange,
} from "@/shared/components/dashboard";

export interface IngredientRow {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
}

const columnHelper = createColumnHelper<IngredientRow>();

export const IngredientsTable: React.FC<{ ingredients: IngredientRow[] }> = ({
	ingredients,
}) => {
	const columns = React.useMemo(
		() => [
			columnHelper.accessor("id", {
				id: "id",
				header: "ID",
				cell: (info) => <span className="font-medium">{info.getValue()}</span>,
			}),
			columnHelper.accessor("imageUrl", {
				id: "image",
				header: "Фото",
				enableSorting: false,
				enableColumnFilter: false,
				cell: ({ row }) => (
					<img
						src={row.original.imageUrl}
						alt={row.original.name}
						width={40}
						height={40}
						className="h-10 w-10 rounded-lg object-cover"
					/>
				),
			}),
			columnHelper.accessor("name", {
				id: "name",
				header: "Название",
				cell: (info) => <span className="font-medium">{info.getValue()}</span>,
			}),
			columnHelper.accessor("price", {
				id: "price",
				header: "Цена",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="font-semibold">
						{info.getValue().toLocaleString("ru-RU")} ₽
					</span>
				),
				filterFn: numberRangeFilter,
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				enableSorting: false,
				cell: ({ row }) => (
					<div className="flex items-center justify-end gap-1">
						<IngredientFormDialog ingredient={row.original}>
							<Button variant="outline" size="sm">
								Изменить
							</Button>
						</IngredientFormDialog>
						<DeleteButton
							entity="ingredient"
							id={row.original.id}
							title={`Ингредиент «${row.original.name}»`}
						/>
					</div>
				),
			}),
		],
		[],
	);

	return (
		<DataTable
			data={ingredients}
			columns={columns}
			globalFilterFn={includesStringGlobalFilter}
			searchPlaceholder="Поиск: ID, название"
			emptyMessage="Ингредиенты не найдены"
			renderFilters={(table) => {
				const priceValue = table.getColumn("price")?.getFilterValue() as
					| NumberFilterRange
					| undefined;

				return (
					<NumberRangeFilter
						label="Цена, ₽"
						value={priceValue}
						onChange={(value) =>
							table.getColumn("price")?.setFilterValue(value)
						}
					/>
				);
			}}
		/>
	);
};

export { AddIngredientButton };
