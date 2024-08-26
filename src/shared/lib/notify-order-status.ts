import { getOrderStatus } from "@/app/actions";
import { OrderStatus } from "@prisma/client";
import toast from "react-hot-toast";

export const notifyOrderStatus = async () => {
  try {
    const paymentStatus = await getOrderStatus();

    if (paymentStatus === OrderStatus.SUCCEEDED) {
      setTimeout(() => {
        toast.success("Заказ успешно оплачен! Чек отправлен на почту", {
          duration: 6000,
        });
      }, 500);
    } else if (paymentStatus === OrderStatus.CANCELLED) {
      setTimeout(() => {
        toast.error("Заказ был отменен", {
          duration: 6000,
        });
      }, 500);
    } else if (paymentStatus === OrderStatus.PENDING) {
      setTimeout(() => {
        toast.loading("Заказ ожидает оплаты...", {
          duration: 6000,
        });
      }, 500);
    }
  } catch (error) {
    console.error("Ошибка получения статуса заказа: ", error);
    toast.error("Произошла ошибка при получении статуса заказа", {
      duration: 6000,
    });
  }
};
