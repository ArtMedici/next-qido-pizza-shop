"use server";

import axios from "axios";
import { PaymentCallbackData } from "@/@types/yookassa";

export const getPaymentDetails = async (
  paymentId: string,
): Promise<PaymentCallbackData["object"]> => {
  const { data } = await axios.get<PaymentCallbackData["object"]>(
    `https://api.yookassa.ru/v3/payments/${paymentId}`,
    {
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string,
        password: process.env.YOOKASSA_API_KEY as string,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return data;
};
