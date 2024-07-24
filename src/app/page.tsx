import {
	Categories,
	Container,
	Filters,
	ProductsGroupList,
	SortPopup,
	Title,
	TopBar,
} from '@/components/shared';

export default function Home() {
	return (
		<>
			<Container className="mt-10">
				<Title
					text="Все пиццы"
					size="lg"
					className="font-extrabold"
				/>
				<TopBar />
				<Container className="mt-9 pb-14">
					<div className="flex gap-[60px]">
						{/* Фильтрация */}
						<div className="w-[250px]">
							<Filters />
						</div>

						{/* Список товаров */}
						<div className="flex-1">
							<div className="flex flex-col gap-16">
								<ProductsGroupList
									title="Пиццы"
									categoryId={1}
									items={[
										{
											id: 1,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 2,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 3,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 4,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
									]}
								/>
								<ProductsGroupList
									title="Комбо"
									categoryId={2}
									items={[
										{
											id: 1,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 2,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 3,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
										{
											id: 4,
											name: 'Диабло',
											imageUrl:
												'https://media.dodostatic.net/image/r:292x292/11EE7D6149EB101D8727573088FA2EFF.avif',
											items: [
												{
													price: 609,
												},
											],
										},
									]}
								/>
							</div>
						</div>
					</div>
				</Container>
			</Container>
		</>
	);
}
