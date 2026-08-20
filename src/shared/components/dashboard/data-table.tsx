"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	type SortingState,
	type Table as ReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Search,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

export const PAGE_SIZES = [10, 25, 50, 100];

interface Props<TData> {
	data: TData[];
	columns: ColumnDef<TData, any>[];
	globalFilterFn: FilterFn<TData>;
	searchPlaceholder?: string;
	emptyMessage?: string;
	initialHiddenColumns?: string[];
	renderFilters?: (table: ReactTable<TData>) => React.ReactNode;
}

export function DataTable<TData>({
	data,
	columns,
	globalFilterFn,
	searchPlaceholder = "Поиск...",
	emptyMessage = "Данные не найдены",
	initialHiddenColumns = [],
	renderFilters,
}: Props<TData>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(
			Object.fromEntries(initialHiddenColumns.map((column) => [column, false])),
		);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [pageIndex, setPageIndex] = React.useState(0);
	const [pageSize, setPageSize] = React.useState(25);

	const table = useReactTable({
		data,
		columns,
		state: { sorting, columnFilters, columnVisibility, globalFilter },
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	React.useEffect(() => {
		setPageIndex(0);
	}, [globalFilter, columnFilters, pageSize]);

	const rows = table.getSortedRowModel().rows;
	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const safePageIndex = Math.min(pageIndex, pageCount - 1);
	const endIndex = Math.min((safePageIndex + 1) * pageSize, rows.length);
	const visibleRows = rows.slice(0, endIndex);

	const pageNumbers = React.useMemo(() => {
		const result: number[] = [];
		const start = Math.max(0, safePageIndex - 2);
		const finish = Math.min(pageCount - 1, safePageIndex + 2);
		for (let i = start; i <= finish; i++) {
			result.push(i);
		}
		if (result[0] > 0) result.unshift(0);
		if (result[result.length - 1] < pageCount - 1)
			result.push(pageCount - 1);
		return result;
	}, [safePageIndex, pageCount]);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative w-full max-w-xs">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						placeholder={searchPlaceholder}
						className="pl-9"
					/>
				</div>
				{renderFilters?.(table)}
			</div>

			<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sorted = header.column.getIsSorted();

									return (
										<TableHead
											key={header.id}
											className={cn(canSort && "select-none")}>
											{canSort ? (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="flex items-center gap-1.5 font-medium hover:text-foreground">
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
													{sorted === "asc" ? (
														<ArrowUp className="h-3.5 w-3.5" />
													) : sorted === "desc" ? (
														<ArrowDown className="h-3.5 w-3.5" />
													) : (
														<ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
													)}
												</button>
											) : header.isPlaceholder ? null : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{visibleRows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))}
						{visibleRows.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={table.getAllColumns().length}
									className="h-24 text-center text-muted-foreground">
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<p className="text-sm text-muted-foreground">
					Показано {visibleRows.length} из {rows.length}
				</p>

				<div className="flex flex-wrap items-center gap-4">
					{endIndex < rows.length && (
						<Button
							variant="outline"
							onClick={() => setPageIndex((prev) => prev + 1)}>
							Загрузить ещё
						</Button>
					)}

					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">На странице:</span>
						<Select
							value={String(pageSize)}
							onValueChange={(v) => setPageSize(Number(v))}>
							<SelectTrigger className="h-9 w-20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PAGE_SIZES.map((size) => (
									<SelectItem key={size} value={String(size)}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 disabled:!bg-white"
							disabled={safePageIndex === 0}
							onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						{pageNumbers.map((number, index) => (
							<React.Fragment key={number}>
								{index > 0 &&
									pageNumbers[index - 1] !== number - 1 && (
										<span className="px-1 text-sm text-muted-foreground">
											…
										</span>
									)}
								<Button
									variant={number === safePageIndex ? "default" : "outline"}
									size="icon"
									className="h-9 w-9"
									onClick={() => setPageIndex(number)}>
									{number + 1}
								</Button>
							</React.Fragment>
						))}
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 disabled:!bg-white"
							disabled={safePageIndex >= pageCount - 1}
							onClick={() =>
								setPageIndex((prev) => Math.min(pageCount - 1, prev + 1))
							}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
