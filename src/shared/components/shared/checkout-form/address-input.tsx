"use client";

import React from "react";
import {
  AddressSuggestions,
  DaDataAddress,
  DaDataSuggestion,
} from "react-dadata";

import "react-dadata/dist/react-dadata.css";
import { cn } from "@/lib/utils";

interface Props {
  onChange?: (value?: string) => void;
  value?: DaDataSuggestion<DaDataAddress>;
  className?: string;
}

export const AddressInput = React.forwardRef<AddressSuggestions, Props>(
  ({ onChange, value, className }, ref) => {
    return (
      <AddressSuggestions
        token="ec236cb775d12eb9ba45e74c74551bfcc8dc8ef0"
        onChange={(data) => onChange?.(data?.value)}
        inputProps={{
          className: cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ),
          placeholder: "Адрес доставки",
        }}
        highlightClassName="text-primary"
        value={value}
      />
    );
  },
);

AddressInput.displayName = "AddressInput";
