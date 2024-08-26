import React from "react";
import { CartItemDTO } from "@/services/dto/cart.dto";
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { calcOrderPrice } from "@/shared/lib";
import { DELIVERY_PRICE } from "@/lib/calc-order-price";

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

const baseUrl = process.env.HOMEPAGE_URL ? process.env.HOMEPAGE_URL : "";

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, items }) => {
  const totalAmount = items
    .map(
      (item) =>
        item.productItem.price * item.quantity +
        item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0),
    )
    .reduce((acc, item) => acc + item, 0);

  const { taxPrice, totalPrice } = calcOrderPrice(totalAmount);

  return (
    <Html>
      <Head />
      <Preview>QIDO Пицца | Чек</Preview>

      <Tailwind>
        <Body className="bg-white my-auto mx-auto">
          <Container>
            <Section className="relative w-max bg-primary rounded-3xl overflow-hidden border-4 border-primary">
              <Section className="flex flex-col text-xl gap-y-4 py-10 px-10 text-center">
                <Text className="text-4xl">Спасибо за покупку 😊</Text>

                <Text>Ваш заказ #{orderId} оплачен.</Text>
              </Section>

              <Section className="bg-white py-8 px-10 rounded overflow-hidden">
                <Text className="text-xl">Список продуктов:</Text>
                <Hr className="my-3" />
                <Section>
                  {items.map((item) => (
                    <Row key={item.id}>
                      <Column className="flex items-center justify-start gap-x-4">
                        <Img
                          className="w-[96px] h-[96px]"
                          src={item.productItem.product.imageUrl}
                          alt={item.productItem.product.name}
                        />
                      </Column>

                      <Column className="flex flex-1 flex-col gap-y-3">
                        <Text className="text-xl font-bold leading-6">
                          {item.productItem.product.name}
                        </Text>
                        <Section>
                          {item.productItem.pizzaType &&
                            item.productItem.size && (
                              <Text>
                                {item.productItem.pizzaType === 1
                                  ? "Традиционное"
                                  : "Тонкое"}{" "}
                                тесто {item.productItem.size} см
                              </Text>
                            )}
                          {item.ingredients && (
                            <Text className="text-base text-gray-400 w-11/12">
                              {item.ingredients
                                .map((item) => item.name)
                                .join(", ")}
                            </Text>
                          )}
                        </Section>
                      </Column>

                      <Column className="flex gap-x-5 items-center justify-start">
                        <Text className="text-lg">{item.quantity} шт.</Text>
                        <Text className="font-bold text-lg">
                          {item.productItem.price * item.quantity +
                            item.ingredients.reduce(
                              (acc, ingredient) => acc + ingredient.price,
                              0,
                            )}{" "}
                          ₽
                        </Text>
                      </Column>
                      <Hr className="my-3" />
                    </Row>
                  ))}
                </Section>

                <Section>
                  <Row>
                    <Column align="right">
                      <Text className="text-xl">Стоимость корзины:</Text>
                    </Column>

                    <Column>
                      <Text className="text-xl font-bold">{totalAmount} ₽</Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column align="right">
                      <Text className="text-xl">Налог:</Text>
                    </Column>

                    <Column>
                      <Text className="text-xl font-bold">{taxPrice} ₽</Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column align="right">
                      <Text className="text-xl">Доставка:</Text>
                    </Column>

                    <Column>
                      <Text className="text-xl font-bold">
                        {DELIVERY_PRICE} ₽
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column align="right">
                      <Text className="text-xl">Итого:</Text>
                    </Column>

                    <Column>
                      <Text className="text-xl font-bold">{totalPrice} ₽</Text>
                    </Column>
                  </Row>
                </Section>
              </Section>

              <Section className="flex flex-col text-xl text-white gap-y-4 py-10 px-10">
                <Link href={baseUrl}>
                  <Section className="flex items-center justify-center gap-4">
                    <Img src="/logo.png" width={35} height={35} alt="Logo" />
                    <Text className="text-2xl uppercase font-black">QIDO</Text>
                    <Text className="text-sm text-gray-200 leading-3">
                      вкусней уже некуда
                    </Text>
                  </Section>
                </Link>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
