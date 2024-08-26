"use client";

import React from "react";
import {
  AddressInput,
  ClearButton,
  ErrorText,
  FormTextarea,
  WhiteBlock,
} from "@/shared/components/shared";
import { Controller, useFormContext } from "react-hook-form";
import { DaDataAddress, DaDataSuggestion } from "react-dadata/dist/types";

interface Props {
  className?: string;
}

export const CheckoutDeliveryForm: React.FC<Props> = ({ className }) => {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = React.useState("");

  const clearAddressInput = () => {
    setValue("address", "", { shouldValidate: true });
    setInputValue("");
  };

  return (
    <WhiteBlock title="3. Адрес доставки" className={className}>
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <div className="relative">
              <AddressInput
                className="h-12 text-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                {...field}
                onChange={(value: string = "") => {
                  setInputValue(value);
                  field.onChange(value);
                }}
                value={inputValue as unknown as DaDataSuggestion<DaDataAddress>}
              />
              {fieldState.error?.message && (
                <ErrorText
                  text={fieldState.error.message}
                  className="mt-2 ml-2"
                />
              )}
              {inputValue && <ClearButton onClick={clearAddressInput} />}
            </div>
          )}
        />

        <FormTextarea
          name="comment"
          className="text-base"
          placeholder="Комментарий к заказу"
          rows={5}
        />
      </div>
    </WhiteBlock>
  );
};
