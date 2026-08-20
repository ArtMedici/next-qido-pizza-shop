import { Plus } from "lucide-react";
import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { Button } from "@/shared/components/ui";
import { ProductFormDialog } from "@/shared/components/dashboard";
import { ProductsTable, type ProductRow } from "./products-table";

export default async function ProductsPage() {
	const [products, categories, ingredients] = await Promise.all([
		prisma.product.findMany({
			include: {
				category: true,
				items: true,
				ingredients: { select: { id: true } },
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.category.findMany({ orderBy: { id: "asc" } }),
		prisma.ingredient.findMany({
			select: { id: true, name: true },
			orderBy: { name: "asc" },
		}),
	]);

	const rows: ProductRow[] = products.map((product) => ({
		id: product.id,
		name: product.name,
		imageUrl: product.imageUrl,
		categoryId: product.categoryId,
		categoryName: product.category.name,
		variantsCount: product.items.length,
		minPrice: product.items.length
			? Math.min(...product.items.map((item) => item.price))
			: 0,
		items: product.items.map(({ price, size, pizzaType }) => ({
			price,
			size,
			pizzaType,
		})),
		ingredientIds: product.ingredients.map(({ id }) => id),
	}));

	const categoryOptions = categories.map(({ id, name }) => ({ id, name }));
	const ingredientOptions = ingredients.map(({ id, name }) => ({ id, name }));

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Title size="lg" text="Товары" />
					<p className="mt-1 text-muted-foreground">
						Управление каталогом товаров
					</p>
				</div>
				<ProductFormDialog
					categories={categoryOptions}
					ingredients={ingredientOptions}>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Добавить товар
					</Button>
				</ProductFormDialog>
			</div>

			<ProductsTable
				products={rows}
				categories={categoryOptions}
				ingredients={ingredientOptions}
			/>
		</div>
	);
}
