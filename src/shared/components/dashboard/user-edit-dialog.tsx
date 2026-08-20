"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
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
import { updateUserByAdmin } from "@/app/(dashboard)/actions";

interface Props {
	user: {
		id: number;
		fullName: string;
		email: string;
		phone: string | null;
		verified: boolean;
	};
	children: React.ReactNode;
}

export const UserEditDialog: React.FC<Props> = ({ user, children }) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [fullName, setFullName] = useState(user.fullName);
	const [email, setEmail] = useState(user.email);
	const [phone, setPhone] = useState(user.phone ?? "");
	const [verified, setVerified] = useState(user.verified);
	const [password, setPassword] = useState("");

	const submit = () => {
		if (!fullName.trim()) {
			return toast.error("Укажите имя пользователя");
		}
		if (!email.trim() || !email.includes("@")) {
			return toast.error("Укажите корректный email");
		}
		if (password && password.length < 6) {
			return toast.error("Пароль должен быть не короче 6 символов");
		}

		startTransition(async () => {
			const res = await updateUserByAdmin(user.id, {
				fullName,
				email,
				phone,
				verified,
				password: password || undefined,
			});

			if (res?.success) {
				toast.success("Пользователь обновлён");
				setOpen(false);
				setPassword("");
			} else {
				toast.error(res?.error ?? "Произошла ошибка");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>Пользователь #{user.id}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-1.5">
						<Label>Имя</Label>
						<Input
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Email</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Телефон</Label>
						<Input
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="+7 (999) 123-45-67"
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Новый пароль (по желанию)</Label>
						<Input
							type="text"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Оставьте пустым, чтобы не менять"
						/>
					</div>
					<label className="flex cursor-pointer items-center gap-2 text-sm">
						<Checkbox
							checked={verified}
							onCheckedChange={(checked) => setVerified(Boolean(checked))}
						/>
						Email подтверждён
					</label>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Отмена
					</Button>
					<Button loading={isPending} onClick={submit}>
						Сохранить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
