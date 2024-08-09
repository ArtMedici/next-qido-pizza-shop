import { Container, Header } from '@/shared/components/shared';

export const metadata = {
	title: 'Корзина',
};

export default function CheckoutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-[#F4F1EE]">
			<Container>
				<Header
					hasCart={false}
					hasSearch={false}
					className="border-gray-200"
				/>
				{children}
			</Container>
		</main>
	);
}
