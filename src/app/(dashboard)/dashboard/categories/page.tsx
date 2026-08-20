import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { CategoriesTable, type CategoryRow } from "./categories-table";

export default async function CategoriesPage() {
	const categories = await prisma.category.findMany({
		include: { _count: { select: { products: true } } },
		orderBy: { id: "asc" },
	});

	const rows: CategoryRow[] = categories.map((category) => ({
		id: category.id,
		name: category.name,
		productsCount: category._count.products,
	}));

	return (
		<div className="space-y-6">
			<div>
				<Title size="lg" text="Категории" />
				<p className="mt-1 text-muted-foreground">
					Управление категориями товаров
				</p>
			</div>

			<CategoriesTable categories={rows} />
		</div>
	);
}
