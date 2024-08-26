import React from "react";
import { FormInput, WhiteBlock } from "@/shared/components/shared";

interface Props {
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Персональные данные" className={className}>
      <div className="grid grid-cols-2 gap-5">
        <FormInput
          name="firstName"
          className="text-base"
          type="text"
          placeholder="Имя"
        />
        <FormInput
          name="lastName"
          className="text-base"
          type="text"
          placeholder="Фамилия"
        />
        <FormInput
          name="email"
          className="text-base"
          type="email"
          placeholder="E-Mail"
        />
        <FormInput
          name="phone"
          isMask={true}
          maskTemplate="+7 (000) 000-00-00"
          min={10}
          className="text-base"
          type="text"
          placeholder="Телефон"
        />
      </div>
    </WhiteBlock>
  );
};
