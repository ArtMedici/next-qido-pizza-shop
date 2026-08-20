import { Plus } from "lucide-react";
import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { Button } from "@/shared/components/ui";
import {
	StoryCard,
	StoryFormDialog,
	type StoryCardData,
} from "@/shared/components/dashboard";

export default async function StoriesPage() {
	const stories = await prisma.story.findMany({
		include: { items: true },
		orderBy: { createdAt: "desc" },
	});

	const rows: StoryCardData[] = stories.map((story) => ({
		id: story.id,
		previewImageUrl: story.previewImageUrl,
		enabled: story.enabled,
		publishDate: story.publishDate?.toISOString() ?? null,
		expireDate: story.expireDate?.toISOString() ?? null,
		itemsCount: story.items.length,
		items: story.items.map((item) => ({ sourceUrl: item.sourceUrl })),
	}));

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Title size="lg" text="Stories" />
					<p className="mt-1 text-muted-foreground">
						Управление сторис на главной странице
					</p>
				</div>
				<StoryFormDialog>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Добавить сторис
					</Button>
				</StoryFormDialog>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{rows.map((story) => (
					<StoryCard key={story.id} story={story} />
				))}
				{rows.length === 0 && (
					<p className="text-sm text-muted-foreground">Сторис пока нет</p>
				)}
			</div>
		</div>
	);
}
