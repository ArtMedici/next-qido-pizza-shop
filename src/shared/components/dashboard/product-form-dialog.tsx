"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui";
import { mapPizzaSize, mapPizzaType } from "@/shared/constants";
import {
	createProduct,
	updateProduct,
} from "@/app/(dashboard)/actions";

interface ItemRow {
	price: number;
	size: number | null;
	pizzaType: number | null;
}

type Category = { id: number; name: string };
type Ingredient = { id: number; name: string };

type ProductWithDetails = {
	id: number;
	name: string;
	imageUrl: string;
	categoryId: number;
	items: { price: number; size: number | null; pizzaType: number | null }[];
	ingredientIds: number[];
};

interface Props {
	product?: ProductWithDetails;
	categories: Category[];
	ingredients: Ingredient[];
	children: React.ReactNode;
}

export const ProductFormDialog: React.FC<Props> = ({
	product,
	categories,
	ingredients,
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [name, setName] = useState(product?.name ?? "");
	const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
	const [categoryId, setCategoryId] = useState(
		product?.categoryId ? String(product.categoryId) : "",
	);
	const [selectedIngredients, setSelectedIngredients] = useState<number[]>(
		product?.ingredientIds ?? [],
	);
	const [items, setItems] = useState<ItemRow[]>(
		product?.items ?? [{ price: 0, size: 25, pizzaType: 1 }],
	);

	const isEdit = Boolean(product);

	const toggleIngredient = (id: number) => {
		setSelectedIngredients((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const updateItem = (index: number, values: Partial<ItemRow>) => {
		setItems((prev) =>
			prev.map((row, i) => (i === index ? { ...row, ...values } : row)),
		);
	};

	const submit = () => {
		if (!name.trim()) {
			return toast.error("Укажите название товара");
		}
		if (!categoryId) {
			return toast.error("Выберите категорию");
		}
		if (items.length === 0 || items.some((item) => item.price <= 0)) {
			return toast.error("Добавьте хотя бы одну вариацию с ценой больше 0");
		}

		startTransition(async () => {
			const values = {
				name,
				imageUrl,
				categoryId: Number(categoryId),
				ingredients: selectedIngredients,
				items,
			};

			const res = isEdit
				? await updateProduct(product!.id, values)
				: await createProduct(values);

			if (res?.success) {
				toast.success(isEdit ? "Товар обновлён" : "Товар создан");
				setOpen(false);
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-2xl bg-white">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? `Редактирование товара #${product!.id}` : "Новый товар"}
					</DialogTitle>
				</DialogHeader>

				<div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1 scrollbar">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Название</Label>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Пепперони"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Категория</Label>
							<Select value={categoryId} onValueChange={setCategoryId}>
								<SelectTrigger>
									<SelectValue placeholder="Выберите категорию" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={String(category.id)}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label>Ссылка на изображение</Label>
						<Input
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							placeholder="https://..."
						/>
						{imageUrl.trim() && (
							<img
								src={imageUrl}
								alt="Превью"
								className="mt-2 h-20 w-20 rounded-lg object-cover"
							/>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>Вариации (размер, тип теста, цена)</Label>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() =>
									setItems((prev) => [
										...prev,
										{
											price: 0,
											size:
												items[items.length - 1]?.size ?? 25,
											pizzaType:
												items[items.length - 1]?.pizzaType ?? 1,
										},
									])
								}>
								<Plus className="mr-1 h-4 w-4" />
								Добавить
							</Button>
						</div>
						{items.map((item, index) => (
							<div key={index} className="flex items-center gap-2">
								<Select
									value={item.size ? String(item.size) : undefined}
									onValueChange={(v) =>
										updateItem(index, { size: Number(v) })
									}>
									<SelectTrigger className="flex-1">
										<SelectValue placeholder="Размер" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(mapPizzaSize).map(([value, label]) => (
											<SelectItem key={value} value={value}>
												{label} ({value} см)
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									value={item.pizzaType ? String(item.pizzaType) : undefined}
									onValueChange={(v) =>
										updateItem(index, { pizzaType: Number(v) })
									}>
									<SelectTrigger className="flex-1">
										<SelectValue placeholder="Тип теста" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(mapPizzaType).map(([value, label]) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Input
									type="number"
									min={0}
									className="w-28"
									value={item.price}
									onChange={(e) =>
										updateItem(index, {
											price: Number(e.target.value),
										})
									}
									placeholder="Цена"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() =>
										setItems((prev) => prev.filter((_, i) => i !== index))
									}>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						))}
					</div>

					<div className="space-y-2">
						<Label>Ингредиенты</Label>
						<div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-3 scrollbar md:grid-cols-3">
							{ingredients.map((ingredient) => (
								<label
									key={ingredient.id}
									className="flex cursor-pointer items-center gap-2 text-sm">
									<Checkbox
										checked={selectedIngredients.includes(ingredient.id)}
										onCheckedChange={() => toggleIngredient(ingredient.id)}
									/>
									<span className="truncate">{ingredient.name}</span>
								</label>
							))}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Отмена
					</Button>
					<Button loading={isPending} onClick={submit}>
						{isEdit ? "Сохранить" : "Создать"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
