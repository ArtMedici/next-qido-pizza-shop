"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
	Badge,
	Button,
	Checkbox,
} from "@/shared/components/ui";
import {
	DeleteButton,
	StoryFormDialog,
} from "@/shared/components/dashboard";
import { toggleStory } from "@/app/(dashboard)/actions";

export interface StoryCardData {
	id: number;
	previewImageUrl: string;
	enabled: boolean;
	publishDate: string | null;
	expireDate: string | null;
	itemsCount: number;
	items: { sourceUrl: string }[];
}

function formatDateTime(value: string | null) {
	if (!value) return null;
	return format(new Date(value), "dd.MM.yyyy HH:mm");
}

export const StoryCard: React.FC<{ story: StoryCardData }> = ({ story }) => {
	const [enabled, setEnabled] = React.useState(story.enabled);
	const [isPending, startTransition] = React.useTransition();

	const handleToggle = (checked: boolean) => {
		setEnabled(checked);
		startTransition(async () => {
			const res = await toggleStory(story.id, checked);
			if (res?.success) {
				toast.success(
					checked
						? `Сторис #${story.id} включён`
						: `Сторис #${story.id} отключён`,
				);
			} else {
				setEnabled(!checked);
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	const publishLabel = formatDateTime(story.publishDate);
	const expireLabel = formatDateTime(story.expireDate);

	return (
		<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
			<div className="relative aspect-square w-full bg-secondary">
				<img
					src={story.previewImageUrl}
					alt={`Сторис #${story.id}`}
					className={
						"h-full w-full object-cover " +
						(enabled ? "" : "opacity-40 grayscale")
					}
				/>
				<div className="absolute left-3 top-3">
					{enabled ? (
						<Badge variant="success">Включена</Badge>
					) : (
						<Badge variant="destructive">Отключена</Badge>
					)}
				</div>
			</div>
			<div className="space-y-2 px-4 py-3">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold">Сторис #{story.id}</p>
						<p className="text-xs text-muted-foreground">
							{story.itemsCount} изображений
						</p>
					</div>
					<label
						className={
							"flex cursor-pointer items-center gap-2 text-xs text-muted-foreground " +
							(isPending ? "pointer-events-none opacity-60" : "")
						}>
						<Checkbox
							checked={enabled}
							onCheckedChange={(checked) => handleToggle(Boolean(checked))}
						/>
						Показ
					</label>
				</div>

				<div className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
					<p>
						Включён с:{" "}
						<span className="font-medium text-foreground">
							{publishLabel ?? "без ограничения"}
						</span>
					</p>
					<p>
						Отключается:{" "}
						<span className="font-medium text-foreground">
							{expireLabel ?? "вручную"}
						</span>
					</p>
				</div>

				<div className="flex items-center justify-between">
					<StoryFormDialog story={story}>
						<Button variant="outline" size="sm">
							Изменить
						</Button>
					</StoryFormDialog>
					<DeleteButton
						entity="story"
						id={story.id}
						title={`Сторис #${story.id}`}
					/>
				</div>
			</div>
		</div>
	);
};
