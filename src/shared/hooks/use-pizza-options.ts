import { Variant } from "@/shared/components/shared/product-variants";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { getAvailablePizzaTypes } from "@/shared/lib";
import { ProductItem } from "@prisma/client";
import React from "react";
import { useSet } from "react-use";

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  selectedIngredients: Set<number>;
  availablePizzaTypes: Variant[];
  currentItemId?: number;
  setSize: (size: PizzaSize) => void;
  setType: (size: PizzaType) => void;
  addIngredient: (id: number) => void;
}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(30);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<number>([]),
  );

  const availablePizzaTypes = getAvailablePizzaTypes(size, items);

  const currentItemId = items.find(
    (item) => item.pizzaType === type && item.size === size,
  )?.id;

  React.useEffect(() => {
    const isAvailableType = availablePizzaTypes?.find(
      (item) => Number(item.value) === type && !item.disabled,
    );
    const availableType = availablePizzaTypes?.find((item) => !item.disabled);

    if (!isAvailableType && availableType) {
      setType(Number(availableType.value) as PizzaType);
    }
  }, [size]);

  return {
    size,
    type,
    selectedIngredients,
    availablePizzaTypes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
  };
};
