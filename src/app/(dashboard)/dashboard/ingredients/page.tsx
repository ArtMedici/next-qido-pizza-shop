import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { AddIngredientButton } from "@/shared/components/dashboard";
import {
	IngredientsTable,
	type IngredientRow,
} from "./ingredients-table";

export default async function IngredientsPage() {
	const ingredients = await prisma.ingredient.findMany({
		orderBy: { name: "asc" },
	});

	const rows: IngredientRow[] = ingredients.map((ingredient) => ({
		id: ingredient.id,
		name: ingredient.name,
		price: ingredient.price,
		imageUrl: ingredient.imageUrl,
	}));

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Title size="lg" text="Ингредиенты" />
					<p className="mt-1 text-muted-foreground">
						Управление ингредиентами для конструктора пиццы
					</p>
				</div>
				<AddIngredientButton />
			</div>

			<IngredientsTable ingredients={rows} />
		</div>
	);
}
