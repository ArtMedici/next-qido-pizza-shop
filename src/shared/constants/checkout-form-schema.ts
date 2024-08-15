import { z } from 'zod';

export const checkoutFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'Имя должно содержать не менее 2-х букв' }),
	lastName: z
		.string()
		.min(2, { message: 'Фамилия должна содержать не менее 2-х букв' }),
	email: z.string().email({ message: 'Некорректная почта' }),
	phone: z
		.string()
		.transform((val) => val.replace(/[\s+()\-]/g, ''))
		.refine((val) => val.length > 10, {
			message: 'Номер телефона должен содержать 10 цифр',
		}),
	address: z.string().min(2, { message: 'Некорректный адрес' }),
	comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
