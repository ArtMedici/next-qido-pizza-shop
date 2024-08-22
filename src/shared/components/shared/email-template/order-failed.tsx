import React from "react";

interface Props {
  orderId: number;
}

export const OrderFailedTemplate: React.FC<Props> = ({ orderId }) => {
  return (
    <div>
      <h1>Заказ #{orderId} не оплачен 😞</h1>

      <p>
        При оформлении заказа произошла ошибка. Пожалуйста, повторите попытку
        или обратитесь в службу поддержки
      </p>
    </div>
  );
};
