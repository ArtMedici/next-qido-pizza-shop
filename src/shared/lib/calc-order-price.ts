export const DELIVERY_PRICE = 250;
const TAX_PERCENT = 5;

export const calcOrderPrice = (totalAmount: number) => {
  const taxPrice = (totalAmount * TAX_PERCENT) / 100;
  const totalPrice = totalAmount + taxPrice + DELIVERY_PRICE;
  return { taxPrice, totalPrice };
};
