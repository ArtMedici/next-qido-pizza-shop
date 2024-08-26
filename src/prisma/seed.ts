import {
  _ingredients,
  categories,
  pizza_1,
  pizza_2,
  pizza_3,
  pizza_4,
  pizza_5,
  pizza_6,
  products,
} from "./constants";
import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User",
        email: "user@email.com",
        password: hashSync("123456789", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin",
        email: "admin@email.com",
        password: hashSync("123456789", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.ingredient.createMany({
    data: _ingredients,
  });

  await prisma.product.createMany({
    data: products,
  });

  const pizza1 = await prisma.product.create({
    data: pizza_1,
  });
  const pizza2 = await prisma.product.create({
    data: pizza_2,
  });
  const pizza3 = await prisma.product.create({
    data: pizza_3,
  });
  const pizza4 = await prisma.product.create({
    data: pizza_4,
  });
  const pizza5 = await prisma.product.create({
    data: pizza_5,
  });
  const pizza6 = await prisma.product.create({
    data: pizza_6,
  });

  await prisma.productItem.createMany({
    data: [
      // pizza 1
      { productId: pizza1.id, pizzaType: 1, price: 329, size: 25 },
      { productId: pizza1.id, pizzaType: 1, price: 579, size: 30 },
      { productId: pizza1.id, pizzaType: 2, price: 579, size: 30 },
      { productId: pizza1.id, pizzaType: 1, price: 689, size: 35 },
      { productId: pizza1.id, pizzaType: 2, price: 689, size: 35 },
      // pizza 2
      { productId: pizza2.id, pizzaType: 1, price: 299, size: 25 },
      { productId: pizza2.id, pizzaType: 1, price: 559, size: 30 },
      { productId: pizza2.id, pizzaType: 2, price: 559, size: 30 },
      { productId: pizza2.id, pizzaType: 1, price: 689, size: 35 },
      { productId: pizza2.id, pizzaType: 2, price: 689, size: 35 },
      // pizza 3
      { productId: pizza3.id, pizzaType: 1, price: 299, size: 25 },
      { productId: pizza3.id, pizzaType: 1, price: 559, size: 30 },
      { productId: pizza3.id, pizzaType: 2, price: 559, size: 30 },
      { productId: pizza3.id, pizzaType: 1, price: 689, size: 35 },
      { productId: pizza3.id, pizzaType: 2, price: 689, size: 35 },
      // pizza 4
      { productId: pizza4.id, pizzaType: 1, price: 569, size: 25 },
      { productId: pizza4.id, pizzaType: 1, price: 859, size: 30 },
      { productId: pizza4.id, pizzaType: 2, price: 859, size: 30 },
      { productId: pizza4.id, pizzaType: 1, price: 999, size: 35 },
      { productId: pizza4.id, pizzaType: 2, price: 999, size: 35 },
      // pizza 5
      { productId: pizza5.id, pizzaType: 1, price: 499, size: 25 },
      { productId: pizza5.id, pizzaType: 1, price: 729, size: 30 },
      { productId: pizza5.id, pizzaType: 2, price: 729, size: 30 },
      { productId: pizza5.id, pizzaType: 1, price: 899, size: 35 },
      { productId: pizza5.id, pizzaType: 2, price: 899, size: 35 },
      // pizza 6
      { productId: pizza6.id, pizzaType: 1, price: 629, size: 25 },
      { productId: pizza6.id, pizzaType: 1, price: 969, size: 30 },
      { productId: pizza6.id, pizzaType: 2, price: 969, size: 30 },
      { productId: pizza6.id, pizzaType: 1, price: 1109, size: 35 },
      { productId: pizza6.id, pizzaType: 2, price: 1109, size: 35 },
      // Other products
      { productId: 1, price: 199 },
      { productId: 2, price: 199 },
      { productId: 3, price: 159 },
      { productId: 4, price: 269 },
      { productId: 5, price: 269 },
      { productId: 6, price: 310 },
      { productId: 7, price: 189 },
      { productId: 8, price: 209 },
      { productId: 9, price: 230 },
      { productId: 10, price: 230 },
      { productId: 11, price: 230 },
      { productId: 12, price: 195 },
      { productId: 13, price: 159 },
      { productId: 14, price: 159 },
      { productId: 15, price: 159 },
      { productId: 16, price: 109 },
      { productId: 17, price: 159 },
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: "11111",
      },
      {
        userId: 2,
        totalAmount: 0,
        token: "22222",
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });

  await prisma.story.createMany({
    data: [
      {
        previewImageUrl: "/assets/images/stories/r4gcw0aselwvf628pbmj3j.webp",
      },
      {
        previewImageUrl: "/assets/images/stories/7ls1yj9fe5bwvuwgym73.webp",
      },
      {
        previewImageUrl: "/assets/images/stories/u37vankpngyccqvgzb.webp",
      },
      {
        previewImageUrl: "/assets/images/stories/nceu2ywv82tdlnpwriyrq.webp",
      },
      {
        previewImageUrl: "/assets/images/stories/atrdxn155bo7n45cb.webp",
      },
      {
        previewImageUrl: "/assets/images/stories/rar8zdspl4saq4uajms.webp",
      },
    ],
  });

  await prisma.storyItem.createMany({
    data: [
      {
        storyId: 1,
        sourceUrl: "/assets/images/stories/story/x9feuljibke3mkna5t.webp",
      },
      {
        storyId: 1,
        sourceUrl: "/assets/images/stories/story/ic5zarojdm7eus0trt.webp",
      },
      {
        storyId: 1,
        sourceUrl: "/assets/images/stories/story/tyxdxnjqbzufonxd8f4cb.webp",
      },
      {
        storyId: 1,
        sourceUrl: "/assets/images/stories/story/mdojadcbw7oojxlcul.webp",
      },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE;`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
