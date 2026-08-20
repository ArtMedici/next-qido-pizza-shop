"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { UserRole } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui";
import { updateUserRole } from "@/app/(dashboard)/actions";

interface Props {
	userId: number;
	role: UserRole;
	isSelf: boolean;
}

export const UserRoleSelect: React.FC<Props> = ({ userId, role, isSelf }) => {
	const [value, setValue] = useState(role);
	const [isPending, startTransition] = useTransition();

	const handleChange = (next: UserRole) => {
		setValue(next);
		startTransition(async () => {
			const res = await updateUserRole(userId, next);
			if (res?.success) {
				toast.success("Роль пользователя обновлена");
			} else {
				setValue(role);
				toast.error(res?.error ?? "Не удалось обновить роль");
			}
		});
	};

	return (
		<Select
			value={value}
			disabled={isPending || isSelf}
			onValueChange={(v) => handleChange(v as UserRole)}>
			<SelectTrigger className="h-9 w-[140px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="USER">Пользователь</SelectItem>
				<SelectItem value="ADMIN">Администратор</SelectItem>
			</SelectContent>
		</Select>
	);
};
