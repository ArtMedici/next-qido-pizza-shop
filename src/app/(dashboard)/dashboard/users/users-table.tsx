"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { UserRole } from "@prisma/client";
import { Badge, Button } from "@/shared/components/ui";
import {
	DataTable,
	DateRangeFilter,
	DeleteButton,
	SelectColumnFilter,
	UserEditDialog,
	dateRangeFilter,
	includesStringGlobalFilter,
	type DateFilterRange,
} from "@/shared/components/dashboard";
import { UserRoleSelect } from "@/shared/components/dashboard/user-role-select";

export interface UserRow {
	id: number;
	fullName: string;
	email: string;
	phone: string | null;
	verified: boolean;
	role: UserRole;
	provider: string | null;
	createdAt: string;
	isSelf: boolean;
}

const roleLabels: Record<UserRole, string> = {
	USER: "Пользователь",
	ADMIN: "Администратор",
};

const columnHelper = createColumnHelper<UserRow>();

export const UsersTable: React.FC<{ users: UserRow[] }> = ({ users }) => {
	const columns = React.useMemo(
		() => [
			columnHelper.accessor("id", {
				id: "id",
				header: "ID",
				cell: (info) => <span className="font-medium">{info.getValue()}</span>,
			}),
			columnHelper.accessor("fullName", {
				id: "fullName",
				header: "Имя",
				cell: ({ row, getValue }) => (
					<div className="flex items-center gap-2">
						{getValue()}
						{row.original.isSelf && <Badge variant="secondary">Вы</Badge>}
					</div>
				),
			}),
			columnHelper.accessor("email", {
				id: "email",
				header: "Email",
				cell: (info) => <span className="break-all">{info.getValue()}</span>,
			}),
			columnHelper.accessor((row) => row.phone ?? "", {
				id: "phone",
				header: "Телефон",
				cell: (info) => (
					<span className="text-muted-foreground">
						{info.getValue() || "—"}
					</span>
				),
			}),
			columnHelper.accessor("verified", {
				id: "verified",
				header: "Подтверждён",
				cell: (info) =>
					info.getValue() ? (
						<Badge variant="success">Да</Badge>
					) : (
						<Badge variant="outline">Нет</Badge>
					),
			}),
			columnHelper.accessor("role", {
				id: "role",
				header: "Роль",
				cell: ({ row, getValue }) => (
					<UserRoleSelect
						userId={row.original.id}
						role={getValue()}
						isSelf={row.original.isSelf}
					/>
				),
				enableSorting: false,
			}),
			columnHelper.accessor("createdAt", {
				id: "createdAt",
				header: "Регистрация",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="text-muted-foreground">
						{new Date(info.getValue()).toLocaleDateString("ru-RU")}
					</span>
				),
				filterFn: dateRangeFilter,
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				enableSorting: false,
				cell: ({ row }) => (
					<div className="flex items-center justify-end gap-1">
						<UserEditDialog
							user={{
								id: row.original.id,
								fullName: row.original.fullName,
								email: row.original.email,
								phone: row.original.phone,
								verified: row.original.verified,
							}}>
							<Button variant="outline" size="sm">
								Изменить
							</Button>
						</UserEditDialog>
						{!row.original.isSelf && (
							<DeleteButton
								entity="user"
								id={row.original.id}
								title={`Пользователь ${row.original.fullName}`}
							/>
						)}
					</div>
				),
			}),
		],
		[],
	);

	return (
		<DataTable
			data={users}
			columns={columns}
			globalFilterFn={includesStringGlobalFilter}
			searchPlaceholder="Поиск: ID, имя, email, телефон"
			emptyMessage="Пользователи не найдены"
			renderFilters={(table) => {
				const roleValue = table.getColumn("role")?.getFilterValue() as
					| string
					| undefined;
				const dateValue = table.getColumn("createdAt")?.getFilterValue() as
					| DateFilterRange
					| undefined;

				return (
					<>
						<SelectColumnFilter
							value={roleValue}
							onChange={(value) =>
								table.getColumn("role")?.setFilterValue(value)
							}
							allLabel="Все роли"
							options={Object.entries(roleLabels).map(([value, label]) => ({
								value,
								label,
							}))}
						/>
						<DateRangeFilter
							label="Дата регистрации"
							value={dateValue}
							onChange={(value) =>
								table.getColumn("createdAt")?.setFilterValue(value)
							}
						/>
					</>
				);
			}}
		/>
	);
};
