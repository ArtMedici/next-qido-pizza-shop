import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "Минимальная длина пароля 6 символов" });

export const formLoginSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z.string().min(2, { message: "Введите имя и фамилию" }),
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;

export const formProfileSchema = z
  .object({
    email: z.string().email({ message: "Введите корректную почту" }),
    fullName: z.string().min(2, { message: "Введите имя и фамилию" }),
    phone: z
      .string()
      .refine(
        (val) => val === "" || val.replace(/[\s+()\-]/g, "").length > 10,
        { message: "Номер телефона должен содержать 10 цифр" },
      ),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type TFormProfileValues = z.infer<typeof formProfileSchema>;
