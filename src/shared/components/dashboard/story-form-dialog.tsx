"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
} from "@/shared/components/ui";
import { Calendar } from "@/shared/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { createStory, updateStory } from "@/app/(dashboard)/actions";

type DateTimeValue = { date?: Date; time: string };

function toDateTime(value: DateTimeValue): Date | null {
	if (!value.date) return null;
	const [hours, minutes] = value.time.split(":").map(Number);
	const result = new Date(value.date);
	result.setHours(hours || 0, minutes || 0, 0, 0);
	return result;
}

function fromDateTime(value: string | Date | null): DateTimeValue {
	if (!value) return { date: undefined, time: "00:00" };
	const date = new Date(value);
	return {
		date,
		time: `${String(date.getHours()).padStart(2, "0")}:${String(
			date.getMinutes(),
		).padStart(2, "0")}`,
	};
}

const DateTimePicker: React.FC<{
	label: string;
	value: DateTimeValue;
	onChange: (value: DateTimeValue) => void;
}> = ({ label, value, onChange }) => {
	return (
		<div className="space-y-1.5">
			<Label>{label}</Label>
			<div className="flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"h-10 w-full justify-start text-left font-normal",
								!value.date && "text-muted-foreground",
							)}>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{value.date
								? format(value.date, "dd.MM.yyyy")
								: "Без ограничения"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-3" align="start">
						<div className="flex flex-col gap-2">
							<Calendar
								mode="single"
								selected={value.date}
								onSelect={(date) => onChange({ ...value, date })}
							/>
							{value.date && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										onChange({ date: undefined, time: "00:00" })
									}>
									Сбросить дату
								</Button>
							)}
						</div>
					</PopoverContent>
				</Popover>
				<Input
					type="time"
					className="w-32"
					value={value.time}
					onChange={(e) => onChange({ ...value, time: e.target.value })}
				/>
			</div>
		</div>
	);
};

interface Props {
	story?: {
		id: number;
		previewImageUrl: string;
		enabled: boolean;
		publishDate: string | null;
		expireDate: string | null;
		items: { sourceUrl: string }[];
	};
	children: React.ReactNode;
}

export const StoryFormDialog: React.FC<Props> = ({ story, children }) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const isEdit = Boolean(story);

	const [previewImageUrl, setPreviewImageUrl] = useState(
		story?.previewImageUrl ?? "",
	);
	const [urls, setUrls] = useState<string[]>(
		story?.items.map((item) => item.sourceUrl) ?? [""],
	);
	const [enabled, setEnabled] = useState(story?.enabled ?? true);
	const [publish, setPublish] = useState<DateTimeValue>(
		fromDateTime(story?.publishDate ?? null),
	);
	const [expire, setExpire] = useState<DateTimeValue>(
		fromDateTime(story?.expireDate ?? null),
	);

	const submit = () => {
		if (!previewImageUrl.trim()) {
			return toast.error("Укажите превью-изображение");
		}

		const publishDate = toDateTime(publish);
		const expireDate = toDateTime(expire);

		if (publishDate && expireDate && expireDate <= publishDate) {
			return toast.error("Дата отключения должна быть позже даты включения");
		}

		const items = urls.map((u) => u.trim()).filter(Boolean);
		if (items.length === 0) {
			return toast.error("Добавьте хотя бы одно изображение сторис");
		}

		startTransition(async () => {
			const values = {
				previewImageUrl,
				items,
				enabled,
				publishDate,
				expireDate,
			};

			const res = isEdit
				? await updateStory(story!.id, values)
				: await createStory(values);

			if (res?.success) {
				toast.success(isEdit ? "Сторис обновлён" : "Сторис создан");
				setOpen(false);
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-lg bg-white">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? `Сторис #${story!.id}` : "Новый сторис"}
					</DialogTitle>
				</DialogHeader>

				<div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1 scrollbar">
					<div className="space-y-1.5">
						<Label>Превью-изображение</Label>
						<Input
							value={previewImageUrl}
							onChange={(e) => setPreviewImageUrl(e.target.value)}
							placeholder="https://..."
						/>
						{previewImageUrl.trim() && (
							<img
								src={previewImageUrl}
								alt="Превью"
								className="mt-2 h-20 w-20 rounded-lg object-cover"
							/>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>Изображения сторис</Label>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setUrls((prev) => [...prev, ""])}>
								<Plus className="mr-1 h-4 w-4" />
								Добавить
							</Button>
						</div>
						{urls.map((url, index) => (
							<div key={index} className="flex items-center gap-2">
								<Input
									value={url}
									onChange={(e) =>
										setUrls((prev) =>
											prev.map((u, i) =>
												i === index ? e.target.value : u,
											),
										)
									}
									placeholder={`https://... (изображение ${index + 1})`}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() =>
										setUrls((prev) => prev.filter((_, i) => i !== index))
									}>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						))}
					</div>

					<div className="space-y-3 rounded-lg border p-4">
						<p className="text-sm font-semibold">Показ сторис</p>
						<label className="flex cursor-pointer items-center gap-2 text-sm">
							<Checkbox
								checked={enabled}
								onCheckedChange={(checked) => setEnabled(Boolean(checked))}
							/>
							Включён
						</label>
						<DateTimePicker
							label="Включить с (дата и время)"
							value={publish}
							onChange={setPublish}
						/>
						<DateTimePicker
							label="Отключить после (дата и время)"
							value={expire}
							onChange={setExpire}
						/>
						<p className="text-xs text-muted-foreground">
							Если даты не выбраны — сторис показывается постоянно, пока
							включён вручную
						</p>
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
