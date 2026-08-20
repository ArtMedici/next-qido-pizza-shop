"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { FilterFn } from "@tanstack/react-table";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { ru } from 'date-fns/locale';

export interface DateFilterRange {
	from?: Date;
	to?: Date;
}

export interface NumberFilterRange {
	from?: number;
	to?: number;
}

export const includesStringGlobalFilter: FilterFn<any> = (
	row,
	columnId,
	value,
) => {
	if (!value) return true;
	const cell = row.getValue(columnId);
	if (cell == null) return false;
	return String(cell).toLowerCase().includes(String(value).toLowerCase().trim());
};

export const numberRangeFilter: FilterFn<any> = (row, columnId, value) => {
	if (!value) return true;
	const rowValue = Number(row.getValue(columnId));
	if (Number.isNaN(rowValue)) return false;
	if ((value as NumberFilterRange).from != null && rowValue < value.from)
		return false;
	if ((value as NumberFilterRange).to != null && rowValue > value.to)
		return false;
	return true;
};

export const dateRangeFilter: FilterFn<any> = (row, columnId, value) => {
	if (!value) return true;
	const raw = row.getValue(columnId);
	const time = new Date(raw as string | number).getTime();
	if (Number.isNaN(time)) return false;

	const { from, to } = value as DateFilterRange;
	if (from) {
		const start = new Date(from);
		start.setHours(0, 0, 0, 0);
		if (time < start.getTime()) return false;
	}
	if (to) {
		const end = new Date(to);
		end.setHours(23, 59, 59, 999);
		if (time > end.getTime()) return false;
	}
	return true;
};

export const arrayIncludesFilter: FilterFn<any> = (row, columnId, value) => {
	if (!value || (value as unknown[]).length === 0) return true;
	return (value as unknown[]).includes(row.getValue(columnId));
};

export const DateRangeFilter: React.FC<{
	value: DateFilterRange | undefined;
	onChange: (value: DateFilterRange | undefined) => void;
	label?: string;
	className?: string;
}> = ({ value, onChange, label = "Выбрать дату", className }) => {
	const range: DateRange | undefined =
		value?.from || value?.to
			? { from: value?.from, to: value?.to }
			: undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-10 justify-start text-left font-normal",
						!range && "text-muted-foreground",
						className,
					)}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{range?.from ? (
						range.to ? (
							<>
								{format(range.from, "dd.MM.yyyy")} —{" "}
								{format(range.to, "dd.MM.yyyy")}
							</>
						) : (
							format(range.from, "dd.MM.yyyy")
						)
					) : (
						label
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="flex flex-col gap-2 p-3">
					<Calendar
						mode="range"
						locale={ru}
						defaultMonth={range?.from}
						selected={range}
						numberOfMonths={2}
						onSelect={(r) =>
							onChange(
								r && (r.from || r.to)
									? { from: r.from, to: r.to }
									: undefined,
							)
						}
					/>
					{range && (
						<Button variant="ghost" size="sm" onClick={() => onChange(undefined)}>
							Сбросить
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export const NumberRangeFilter: React.FC<{
	value: NumberFilterRange | undefined;
	onChange: (value: NumberFilterRange | undefined) => void;
	label: string;
	className?: string;
}> = ({ value, onChange, label, className }) => {
	const [open, setOpen] = React.useState(false);
	const active = value?.from != null || value?.to != null;

	const handleChange = (key: keyof NumberFilterRange, raw: string) => {
		const next: NumberFilterRange = { ...value };
		if (raw === "") {
			delete next[key];
		} else {
			const num = Number(raw);
			if (Number.isNaN(num)) return;
			next[key] = num;
		}
		onChange(next.from != null || next.to != null ? next : undefined);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-10 justify-start font-normal",
						!active && "text-muted-foreground",
						className,
					)}>
					{active ? `${label}: ${value?.from ?? 0}–${value?.to ?? "∞"}` : label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-3" align="start">
				<div className="flex items-center gap-2">
					<Input
						type="number"
						placeholder="От"
						value={value?.from ?? ""}
						onChange={(e) => handleChange("from", e.target.value)}
					/>
					<Input
						type="number"
						placeholder="До"
						value={value?.to ?? ""}
						onChange={(e) => handleChange("to", e.target.value)}
					/>
				</div>
				{active && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 w-full"
						onClick={() => onChange(undefined)}>
						Сбросить
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
};

export const SelectColumnFilter: React.FC<{
	value: string | undefined;
	onChange: (value: string | undefined) => void;
	options: { value: string; label: string }[];
	allLabel?: string;
	placeholder?: string;
	className?: string;
}> = ({ value, onChange, options, allLabel = "Все", placeholder, className }) => {
	return (
		<Select
			value={value ?? "all"}
			onValueChange={(v) => onChange(v === "all" ? undefined : v)}>
			<SelectTrigger className={cn("h-10 w-[170px]", className)}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">{allLabel}</SelectItem>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export const MultiSelectFilter: React.FC<{
	value: (number | string)[];
	onChange: (value: (number | string)[]) => void;
	options: { value: number | string; label: string }[];
	label: string;
	className?: string;
}> = ({ value, onChange, options, label, className }) => {
	const toggle = (optionValue: number | string) => {
		const next = value.includes(optionValue)
			? value.filter((v) => v !== optionValue)
			: [...value, optionValue];
		onChange(next);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-10 justify-start font-normal",
						value.length === 0 && "text-muted-foreground",
						className,
					)}>
					{value.length > 0 ? `${label} (${value.length})` : label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-3" align="start">
				<div className="max-h-56 space-y-2 overflow-y-auto scrollbar">
					{options.map((option) => (
						<label
							key={String(option.value)}
							className="flex cursor-pointer items-center gap-2 text-sm">
							<Checkbox
								checked={value.includes(option.value)}
								onCheckedChange={() => toggle(option.value)}
							/>
							<span className="truncate">{option.label}</span>
						</label>
					))}
				</div>
				{value.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 w-full"
						onClick={() => onChange([])}>
						Сбросить
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
};
