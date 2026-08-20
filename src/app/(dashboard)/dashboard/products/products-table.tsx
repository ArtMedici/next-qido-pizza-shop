"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui";
import {
	DataTable,
	DeleteButton,
	MultiSelectFilter,
	NumberRangeFilter,
	ProductFormDialog,
	arrayIncludesFilter,
	includesStringGlobalFilter,
	numberRangeFilter,
	type NumberFilterRange,
} from "@/shared/components/dashboard";

export interface ProductRow {
	id: number;
	name: string;
	imageUrl: string;
	categoryId: number;
	categoryName: string;
	variantsCount: number;
	minPrice: number;
	items: { price: number; size: number | null; pizzaType: number | null }[];
	ingredientIds: number[];
}

const columnHelper = createColumnHelper<ProductRow>();

export const ProductsTable: React.FC<{
	products: ProductRow[];
	categories: { id: number; name: string }[];
	ingredients: { id: number; name: string }[];
}> = ({ products, categories, ingredients }) => {
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
						width={48}
						height={48}
						className="h-12 w-12 rounded-lg object-cover"
					/>
				),
			}),
			columnHelper.accessor("name", {
				id: "name",
				header: "Название",
				cell: (info) => <span className="font-medium">{info.getValue()}</span>,
			}),
			columnHelper.accessor("categoryName", {
				id: "categoryName",
				header: "Категория",
			}),
			columnHelper.accessor("categoryId", {
				id: "categoryId",
				header: "Категория (фильтр)",
				enableColumnFilter: false,
				enableGlobalFilter: false,
				size: 0,
				cell: () => null,
				filterFn: arrayIncludesFilter,
			}),
			columnHelper.accessor("variantsCount", {
				id: "variantsCount",
				header: "Вариации",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="text-muted-foreground">{info.getValue()} шт.</span>
				),
				filterFn: numberRangeFilter,
			}),
			columnHelper.accessor("minPrice", {
				id: "minPrice",
				header: "Цена от",
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
						<ProductFormDialog
							product={{
								id: row.original.id,
								name: row.original.name,
								imageUrl: row.original.imageUrl,
								categoryId: row.original.categoryId,
								items: row.original.items,
								ingredientIds: row.original.ingredientIds,
							}}
							categories={categories}
							ingredients={ingredients}>
							<Button variant="outline" size="sm">
								Изменить
							</Button>
						</ProductFormDialog>
						<DeleteButton
							entity="product"
							id={row.original.id}
							title={`Товар «${row.original.name}»`}
						/>
					</div>
				),
			}),
		],
		[categories, ingredients],
	);

	return (
		<DataTable
			data={products}
			columns={columns}
			globalFilterFn={includesStringGlobalFilter}
			searchPlaceholder="Поиск: ID, название"
			emptyMessage="Товары не найдены"
			initialHiddenColumns={["categoryId"]}
			renderFilters={(table) => {
				const categoryValue = (table.getColumn("categoryId")?.getFilterValue() ??
					[]) as number[];
				const variantsValue = table
					.getColumn("variantsCount")
					?.getFilterValue() as NumberFilterRange | undefined;
				const priceValue = table.getColumn("minPrice")?.getFilterValue() as
					| NumberFilterRange
					| undefined;

				return (
					<>
						<MultiSelectFilter
							label="Категории"
							className="w-full max-w-xs"
							value={categoryValue}
							onChange={(value) =>
								table
									.getColumn("categoryId")
									?.setFilterValue(value.length > 0 ? value : undefined)
							}
							options={categories.map((category) => ({
								value: category.id,
								label: category.name,
							}))}
						/>
						<NumberRangeFilter
							label="Вариации"
							value={variantsValue}
							onChange={(value) =>
								table.getColumn("variantsCount")?.setFilterValue(value)
							}
						/>
						<NumberRangeFilter
							label="Цена, ₽"
							value={priceValue}
							onChange={(value) =>
								table.getColumn("minPrice")?.setFilterValue(value)
							}
						/>
					</>
				);
			}}
		/>
	);
};
