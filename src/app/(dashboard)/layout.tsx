import { requireAdmin } from "@/shared/lib/require-admin";
import { DashboardSidebar } from "@/shared/components/dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "QIDO Pizza | Админ-панель",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const admin = await requireAdmin();

	return (
		<div className="flex min-h-screen bg-[#f8f8f8]">
			<DashboardSidebar />
			<div className="flex-1">
				<header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-8">
					<p className="ml-auto text-sm text-muted-foreground">
						Администратор:{" "}
						<span className="font-semibold text-foreground">{admin.name}</span>
					</p>
				</header>
				<main className="p-8">{children}</main>
			</div>
		</div>
	);
}
