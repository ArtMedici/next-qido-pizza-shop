"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
} from "@/shared/components/ui";
import { createIngredient, updateIngredient } from "@/app/(dashboard)/actions";

type IngredientValues = {
	id?: number;
	name: string;
	price: number;
	imageUrl: string;
};

interface Props {
	ingredient?: IngredientValues;
	children: React.ReactNode;
}

export const IngredientFormDialog: React.FC<Props> = ({
	ingredient,
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const isEdit = Boolean(ingredient?.id);

	const [name, setName] = useState(ingredient?.name ?? "");
	const [price, setPrice] = useState(ingredient?.price ?? 0);
	const [imageUrl, setImageUrl] = useState(ingredient?.imageUrl ?? "");

	const submit = () => {
		if (!name.trim()) {
			return toast.error("Укажите название ингредиента");
		}
		if (price <= 0) {
			return toast.error("Цена должна быть больше 0");
		}

		startTransition(async () => {
			const values = { name, price, imageUrl };

			const res = isEdit
				? await updateIngredient(ingredient!.id!, values)
				: await createIngredient(values);

			if (res?.success) {
				toast.success(isEdit ? "Ингредиент обновлён" : "Ингредиент создан");
				setOpen(false);
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>
						{isEdit
							? `Редактирование ингредиента #${ingredient?.id}`
							: "Новый ингредиент"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-1.5">
						<Label>Название</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Моцарелла"
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Цена, ₽</Label>
						<Input
							type="number"
							min={0}
							value={price}
							onChange={(e) => setPrice(Number(e.target.value))}
						/>
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
								className="mt-2 h-16 w-16 rounded-lg object-cover"
							/>
						)}
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

export const AddIngredientButton: React.FC = () => {
	return (
		<IngredientFormDialog>
			<Button>
				<Plus className="mr-2 h-4 w-4" />
				Добавить ингредиент
			</Button>
		</IngredientFormDialog>
	);
};
