import React from "react";
import { CartItemDTO } from "@/services/dto/cart.dto";

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, items }) => {
  return (
    <div>
      <h1>Спасибо за покупку 😊</h1>

      <p>Ваш заказ #{orderId} оплачен. Список товаров:</p>

      <hr />

      <ul>
        {items
          .map((item) => (
            <li key={item.id}>
              {item.productItem.product.name} | {item.productItem.price} ₽ x{" "}
              {item.quantity} шт. | Выбранные ингредиенты:{" "}
              {item.ingredients.map((ingredient) => ingredient.name).join(", ")}
              | Всего:{" "}
              {item.productItem.price * item.quantity +
                item.ingredients.reduce(
                  (acc, ingredient) => acc + ingredient.price,
                  0,
                )}{" "}
              ₽ | | Итого:{" "}
              {item.productItem.price * item.quantity +
                item.ingredients.reduce(
                  (acc, ingredient) => acc + ingredient.price,
                  0,
                )}{" "}
              ₽
            </li>
          ))
          .join("")}
      </ul>
    </div>
  );
};
