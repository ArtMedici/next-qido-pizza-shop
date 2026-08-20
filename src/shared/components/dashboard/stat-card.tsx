import { OrderStatus } from "@prisma/client";
import { cn } from "@/shared/lib/utils";

const cardVariants = {
	revenue: "bg-primary/10 text-primary",
	orders: "bg-blue-100 text-blue-600",
	users: "bg-purple-100 text-purple-600",
	average: "bg-green-100 text-green-600",
} as const;

interface Props {
	title: string;
	value: string;
	hint?: string;
	icon: React.ReactNode;
	variant?: keyof typeof cardVariants;
	className?: string;
}

export const StatCard: React.FC<Props> = ({
	title,
	value,
	hint,
	icon,
	variant = "revenue",
	className,
}) => {
	return (
		<div
			className={cn(
				"flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm",
				className,
			)}>
			<div
				className={cn(
					"flex h-14 w-14 shrink-0 items-center justify-center rounded-lg",
					cardVariants[variant],
				)}>
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-sm text-muted-foreground">{title}</p>
				<p className="truncate text-2xl font-extrabold">{value}</p>
				{hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
			</div>
		</div>
	);
};
