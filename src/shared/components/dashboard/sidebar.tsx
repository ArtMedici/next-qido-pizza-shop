"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	Film,
	LayoutDashboard,
	Layers,
	Pizza,
	Salad,
	ShoppingBag,
	Users,
	Store,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const items = [
	{ href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
	{ href: "/dashboard/orders", label: "Заказы", icon: ShoppingBag },
	{ href: "/dashboard/products", label: "Товары", icon: Pizza },
	{ href: "/dashboard/categories", label: "Категории", icon: Layers },
	{ href: "/dashboard/ingredients", label: "Ингредиенты", icon: Salad },
	{ href: "/dashboard/users", label: "Пользователи", icon: Users },
	{ href: "/dashboard/stories", label: "Stories", icon: Film },
];

export const DashboardSidebar: React.FC = () => {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r bg-white">
			<div className="flex items-center gap-3 border-b px-6 py-5">
				<Image src="/logo.png" alt="QIDO Pizza" width={36} height={36} />
				<div>
					<p className="text-lg font-extrabold uppercase leading-none">
						QIDO Pizza
					</p>
					<p className="text-xs text-muted-foreground">Админ-панель</p>
				</div>
			</div>

			<nav className="flex-1 space-y-1 overflow-y-auto p-3">
				{items.map(({ href, label, icon: Icon }) => {
					const active =
						href === "/dashboard"
							? pathname === href
							: pathname.startsWith(href);

					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								active
									? "bg-primary text-white"
									: "text-muted-foreground hover:bg-secondary hover:text-primary",
							)}>
							<Icon className="h-5 w-5 shrink-0" />
							{label}
						</Link>
					);
				})}
			</nav>

			<div className="border-t p-3">
				<Link
					href="/"
					className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
					<Store className="h-5 w-5 shrink-0" />
					Вернуться на сайт
				</Link>
			</div>
		</aside>
	);
};
