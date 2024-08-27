"use client";

import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/shared/hooks";

import {
  CheckoutCart,
  CheckoutDeliveryForm,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Container,
  Title,
} from "@/shared/components";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";
import { createOrder, isEmptyCart } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Api } from "@/shared/services/api-client";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    totalAmount,
    items,
    productNoun,
    updatingItemId,
    loading,
    removeCartItem,
    onClickCountButton,
  } = useCart();
  const { data: session } = useSession();

  React.useEffect(() => {
    const checkCartIsEmpty = async () => {
      const isEmpty = await isEmptyCart();

      if (isEmpty) router.push("/");
    };

    checkCartIsEmpty();
  }, [router]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      comment: "",
    },
  });

  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(" ");

      form.setValue("firstName", firstName);
      form.setValue("lastName", lastName);
      form.setValue("email", data.email);
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (
    data: CheckoutFormValues,
  ) => {
    try {
      setSubmitting(true);

      const paymentUrl = await createOrder(data);

      if (!paymentUrl) {
        setSubmitting(false);
        toast.error("Не удалось создать заказ", {
          duration: 6000,
        });
        return router.push("/");
      }

      toast.success("Переход к оплате заказа...", {
        icon: "✅",
      });
      location.href = paymentUrl;
    } catch (err) {
      console.log(err);

      setSubmitting(false);
      toast.error("Не удалось создать заказ", {
        icon: "❌",
      });
    }
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold mb-8 text-4xl"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                items={items}
                productNoun={productNoun}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                loading={loading}
                disabledItemId={updatingItemId}
              />

              <CheckoutPersonalForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />

              <CheckoutDeliveryForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />
            </div>

            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
