"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus, UserRole } from "@prisma/client";
import { hashSync } from "bcrypt";
import { prisma } from "@/prisma/prisma-client";
import { requireAdmin } from "@/shared/lib/require-admin";

const ADMIN_PATH = "/dashboard";

export async function updateOrderStatus(id: number, status: OrderStatus) {
	try {
		await requireAdmin();

		await prisma.order.update({
			where: { id },
			data: { status },
		});

		revalidatePath(ADMIN_PATH + "/orders");
		revalidatePath(ADMIN_PATH);

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_ORDER_STATUS] " + error);
		return { success: false, error: "Не удалось обновить статус заказа" };
	}
}

export async function updateUserRole(id: number, role: UserRole) {
	try {
		const admin = await requireAdmin();

		if (Number(admin.id) === id) {
			return { success: false, error: "Нельзя изменить свою роль" };
		}

		await prisma.user.update({
			where: { id },
			data: { role },
		});

		revalidatePath(ADMIN_PATH + "/users");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_USER_ROLE] " + error);
		return { success: false, error: "Не удалось обновить роль пользователя" };
	}
}

export async function createCategory(name: string) {
	try {
		await requireAdmin();

		await prisma.category.create({
			data: { name: name.trim() },
		});

		revalidatePath(ADMIN_PATH + "/categories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [CREATE_CATEGORY] " + error);
		return { success: false, error: "Не удалось создать категорию" };
	}
}

export async function updateCategoryName(id: number, name: string) {
	try {
		await requireAdmin();

		await prisma.category.update({
			where: { id },
			data: { name: name.trim() },
		});

		revalidatePath(ADMIN_PATH + "/categories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_CATEGORY] " + error);
		return { success: false, error: "Не удалось переименовать категорию" };
	}
}

export async function deleteCategory(id: number) {
	try {
		await requireAdmin();

		const productsCount = await prisma.product.count({
			where: { categoryId: id },
		});

		if (productsCount > 0) {
			return {
				success: false,
				error: `Нельзя удалить: в категории ${productsCount} товаров`,
			};
		}

		await prisma.category.delete({ where: { id } });

		revalidatePath(ADMIN_PATH + "/categories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [DELETE_CATEGORY] " + error);
		return { success: false, error: "Не удалось удалить категорию" };
	}
}

interface IngredientValues {
	name: string;
	price: number;
	imageUrl: string;
}

export async function createIngredient(values: IngredientValues) {
	try {
		await requireAdmin();

		await prisma.ingredient.create({
			data: {
				name: values.name.trim(),
				price: values.price,
				imageUrl: values.imageUrl.trim(),
			},
		});

		revalidatePath(ADMIN_PATH + "/ingredients");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [CREATE_INGREDIENT] " + error);
		return { success: false, error: "Не удалось создать ингредиент" };
	}
}

export async function updateIngredient(id: number, values: IngredientValues) {
	try {
		await requireAdmin();

		await prisma.ingredient.update({
			where: { id },
			data: {
				name: values.name.trim(),
				price: values.price,
				imageUrl: values.imageUrl.trim(),
			},
		});

		revalidatePath(ADMIN_PATH + "/ingredients");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_INGREDIENT] " + error);
		return { success: false, error: "Не удалось обновить ингредиент" };
	}
}

export async function deleteIngredient(id: number) {
	try {
		await requireAdmin();

		await prisma.ingredient.delete({ where: { id } });

		revalidatePath(ADMIN_PATH + "/ingredients");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [DELETE_INGREDIENT] " + error);
		return { success: false, error: "Не удалось удалить ингредиент" };
	}
}

interface ProductItemValues {
	price: number;
	size: number | null;
	pizzaType: number | null;
}

interface ProductValues {
	name: string;
	imageUrl: string;
	categoryId: number;
	ingredients: number[];
	items: ProductItemValues[];
}

export async function createProduct(values: ProductValues) {
	try {
		await requireAdmin();

		await prisma.product.create({
			data: {
				name: values.name.trim(),
				imageUrl: values.imageUrl.trim(),
				categoryId: values.categoryId,
				ingredients: { connect: values.ingredients.map((id) => ({ id })) },
				items: { create: values.items },
			},
		});

		revalidatePath(ADMIN_PATH + "/products");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [CREATE_PRODUCT] " + error);
		return { success: false, error: "Не удалось создать товар" };
	}
}

export async function updateProduct(id: number, values: ProductValues) {
	try {
		await requireAdmin();

		await prisma.$transaction([
			prisma.productItem.deleteMany({ where: { productId: id } }),
			prisma.product.update({
				where: { id },
				data: {
					name: values.name.trim(),
					imageUrl: values.imageUrl.trim(),
					categoryId: values.categoryId,
					ingredients: { set: values.ingredients.map((id) => ({ id })) },
					items: { create: values.items },
				},
			}),
		]);

		revalidatePath(ADMIN_PATH + "/products");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_PRODUCT] " + error);
		return { success: false, error: "Не удалось обновить товар" };
	}
}

export async function deleteProduct(id: number) {
	try {
		await requireAdmin();

		const cartItemsCount = await prisma.cartItem.count({
			where: { productItem: { productId: id } },
		});

		if (cartItemsCount > 0) {
			return {
				success: false,
				error: "Нельзя удалить товар, который находится в корзинах покупателей",
			};
		}

		await prisma.productItem.deleteMany({ where: { productId: id } });
		await prisma.product.delete({ where: { id } });

		revalidatePath(ADMIN_PATH + "/products");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [DELETE_PRODUCT] " + error);
		return { success: false, error: "Не удалось удалить товар" };
	}
}

interface StoryValues {
	previewImageUrl: string;
	items: string[];
	enabled: boolean;
	publishDate: Date | null;
	expireDate: Date | null;
}

export async function createStory(values: StoryValues) {
	try {
		await requireAdmin();

		await prisma.story.create({
			data: {
				previewImageUrl: values.previewImageUrl.trim(),
				enabled: values.enabled,
				publishDate: values.publishDate,
				expireDate: values.expireDate,
				items: {
					create: values.items
						.map((url) => url.trim())
						.filter(Boolean)
						.map((sourceUrl) => ({ sourceUrl })),
				},
			},
		});

		revalidatePath(ADMIN_PATH + "/stories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [CREATE_STORY] " + error);
		return { success: false, error: "Не удалось создать сторис" };
	}
}

export async function updateStory(id: number, values: StoryValues) {
	try {
		await requireAdmin();

		await prisma.$transaction([
			prisma.storyItem.deleteMany({ where: { storyId: id } }),
			prisma.story.update({
				where: { id },
				data: {
					previewImageUrl: values.previewImageUrl.trim(),
					enabled: values.enabled,
					publishDate: values.publishDate,
					expireDate: values.expireDate,
					items: {
						create: values.items
							.map((url) => url.trim())
							.filter(Boolean)
							.map((sourceUrl) => ({ sourceUrl })),
					},
				},
			}),
		]);

		revalidatePath(ADMIN_PATH + "/stories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_STORY] " + error);
		return { success: false, error: "Не удалось обновить сторис" };
	}
}

export async function toggleStory(id: number, enabled: boolean) {
	try {
		await requireAdmin();

		await prisma.story.update({
			where: { id },
			data: { enabled },
		});

		revalidatePath(ADMIN_PATH + "/stories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [TOGGLE_STORY] " + error);
		return { success: false, error: "Не удалось изменить видимость сторис" };
	}
}

export async function deleteStory(id: number) {
	try {
		await requireAdmin();

		await prisma.storyItem.deleteMany({ where: { storyId: id } });
		await prisma.story.delete({ where: { id } });

		revalidatePath(ADMIN_PATH + "/stories");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.log("Error [DELETE_STORY] " + error);
		return { success: false, error: "Не удалось удалить сторис" };
	}
}

interface AdminUserValues {
	fullName: string;
	email: string;
	phone: string;
	verified: boolean;
	password?: string;
}

export async function updateUserByAdmin(id: number, values: AdminUserValues) {
	try {
		await requireAdmin();

		await prisma.user.update({
			where: { id },
			data: {
				fullName: values.fullName.trim(),
				email: values.email.trim(),
				phone: values.phone.trim() || null,
				verified: values.verified ? new Date() : null,
				...(values.password
					? { password: hashSync(values.password, 10) }
					: {}),
			},
		});

		revalidatePath(ADMIN_PATH + "/users");

		return { success: true };
	} catch (error) {
		console.log("Error [UPDATE_USER_BY_ADMIN] " + error);

		if ((error as { code?: string })?.code === "P2002") {
			return {
				success: false,
				error: "Пользователь с таким email уже существует",
			};
		}

		return { success: false, error: "Не удалось обновить пользователя" };
	}
}

export async function deleteUser(id: number) {
	try {
		const admin = await requireAdmin();

		if (Number(admin.id) === id) {
			return { success: false, error: "Нельзя удалить свой аккаунт" };
		}

		const cartIds = (
			await prisma.cart.findMany({
				where: { userId: id },
				select: { id: true },
			})
		).map((cart) => cart.id);

		await prisma.$transaction([
			prisma.verificationCode.deleteMany({ where: { userId: id } }),
			prisma.order.updateMany({ where: { userId: id }, data: { userId: null } }),
			prisma.cartItem.updateMany({
				where: { userId: id },
				data: { userId: null },
			}),
			prisma.cartItem.deleteMany({ where: { cartId: { in: cartIds } } }),
			prisma.cart.deleteMany({ where: { userId: id } }),
			prisma.user.delete({ where: { id } }),
		]);

		revalidatePath(ADMIN_PATH + "/users");

		return { success: true };
	} catch (error) {
		console.log("Error [DELETE_USER] " + error);
		return { success: false, error: "Не удалось удалить пользователя" };
	}
}
