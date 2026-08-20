import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/get-user-session";

export async function requireAdmin() {
	const session = await getUserSession();

	if (!session || session.role !== "ADMIN") {
		redirect("/not-auth");
	}

	return session;
}
