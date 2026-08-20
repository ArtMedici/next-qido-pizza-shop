"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Input } from "@/shared/components/ui";
import {
	DataTable,
	DeleteButton,
	includesStringGlobalFilter,
} from "@/shared/components/dashboard";
import {
	createCategory,
	updateCategoryName,
} from "@/app/(dashboard)/actions";

export interface CategoryRow {
	id: number;
	name: string;
	productsCount: number;
}

const columnHelper = createColumnHelper<CategoryRow>();

const CategoryNameCell: React.FC<{ category: CategoryRow }> = ({
	category,
}) => {
	const [isEdit, setIsEdit] = React.useState(false);
	const [name, setName] = React.useState(category.name);
	const [isPending, startTransition] = React.useTransition();

	const handleSave = () => {
		if (!name.trim() || name === category.name) {
			setIsEdit(false);
			return;
		}

		startTransition(async () => {
			const res = await updateCategoryName(category.id, name);
			if (res?.success) {
				toast.success("Категория переименована");
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	if (!isEdit) {
		return (
			<div className="flex items-center gap-1">
				<span className="font-medium">{category.name}</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => setIsEdit(true)}>
					<Pencil className="h-3.5 w-3.5 text-muted-foreground" />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Input
				className="h-9 max-w-xs"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSave();
						setIsEdit(false);
					}
				}}
			/>
			<Button
				size="sm"
				loading={isPending}
				onClick={() => {
					handleSave();
					setIsEdit(false);
				}}>
				Сохранить
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() => {
					setName(category.name);
					setIsEdit(false);
				}}>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
};

export const CategoriesTable: React.FC<{ categories: CategoryRow[] }> = ({
	categories,
}) => {
	const [newName, setNewName] = React.useState("");
	const [isPending, startTransition] = React.useTransition();

	const handleCreate = () => {
		if (!newName.trim()) {
			return toast.error("Укажите название категории");
		}

		startTransition(async () => {
			const res = await createCategory(newName);
			if (res?.success) {
				toast.success("Категория создана");
				setNewName("");
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	const columns = React.useMemo(
		() => [
			columnHelper.accessor("id", {
				id: "id",
				header: "ID",
				cell: (info) => <span className="font-medium">{info.getValue()}</span>,
			}),
			columnHelper.accessor("name", {
				id: "name",
				header: "Название",
				cell: ({ row }) => <CategoryNameCell category={row.original} />,
			}),
			columnHelper.accessor("productsCount", {
				id: "productsCount",
				header: "Товары",
				cell: (info) => (
					<span className="text-muted-foreground">{info.getValue()} шт.</span>
				),
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				enableSorting: false,
				cell: ({ row }) => (
					<div className="flex items-center justify-end">
						<DeleteButton
							entity="category"
							id={row.original.id}
							title={`Категория «${row.original.name}»`}
						/>
					</div>
				),
			}),
		],
		[],
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Input
					className="max-w-sm"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					placeholder="Название новой категории"
					onKeyDown={(e) => e.key === "Enter" && handleCreate()}
				/>
				<Button loading={isPending} onClick={handleCreate}>
					<Plus className="mr-2 h-4 w-4" />
					Создать
				</Button>
			</div>

			<DataTable
				data={categories}
				columns={columns}
				globalFilterFn={includesStringGlobalFilter}
				searchPlaceholder="Поиск: ID, название"
				emptyMessage="Категории не найдены"
			/>
		</div>
	);
};
