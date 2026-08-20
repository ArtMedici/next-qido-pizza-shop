"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui";
import {
	deleteCategory,
	deleteIngredient,
	deleteProduct,
	deleteStory,
	deleteUser,
} from "@/app/(dashboard)/actions";

const deleteActions = {
	product: deleteProduct,
	category: deleteCategory,
	ingredient: deleteIngredient,
	story: deleteStory,
	user: deleteUser,
} as const;

type Entity = keyof typeof deleteActions;

interface Props {
	entity: Entity;
	id: number;
	title: string;
}

export const DeleteButton: React.FC<Props> = ({ entity, id, title }) => {
	const [isPending, startTransition] = useTransition();
	const [confirm, setConfirm] = useState(false);

	const handleClick = () => {
		if (!confirm) {
			setConfirm(true);
			setTimeout(() => setConfirm(false), 3000);
			return;
		}

		startTransition(async () => {
			const res = await deleteActions[entity](id);
			if (res?.success) {
				toast.success(`${title} удалён`);
			} else {
				toast.error(res?.error ?? "Не удалось удалить");
				setConfirm(false);
			}
		});
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			loading={isPending}
			onClick={handleClick}>
			<Trash2
				className={
					"h-4 w-4 " + (confirm ? "text-destructive" : "text-muted-foreground")
				}
			/>
		</Button>
	);
};
