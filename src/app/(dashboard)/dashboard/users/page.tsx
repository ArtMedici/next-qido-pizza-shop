import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/lib/get-user-session";
import { Title } from "@/shared/components/shared";
import { UsersTable, type UserRow } from "./users-table";

export default async function UsersPage() {
	const [users, session] = await Promise.all([
		prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
		getUserSession(),
	]);

	const rows: UserRow[] = users.map((user) => ({
		id: user.id,
		fullName: user.fullName,
		email: user.email,
		phone: user.phone,
		verified: Boolean(user.verified),
		role: user.role,
		provider: user.provider,
		createdAt: user.createdAt.toISOString(),
		isSelf: String(user.id) === session?.id,
	}));

	return (
		<div className="space-y-6">
			<div>
				<Title size="lg" text="Пользователи" />
				<p className="mt-1 text-muted-foreground">
					Управление пользователями, ролями и данными
				</p>
			</div>

			<UsersTable users={rows} />
		</div>
	);
}
