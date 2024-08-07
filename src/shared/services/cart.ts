import { CartDTO, CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { axiosInstance } from '@/shared/services/instance';

export const getCart = async (): Promise<CartDTO> => {
	return (await axiosInstance.get<CartDTO>('/cart')).data;
};
export const updateItemQuantity = async (
	itemId: number,
	quantity: number
): Promise<CartDTO> => {
	return (
		await axiosInstance.patch<CartDTO>('/cart/' + itemId, {
			quantity,
		})
	).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
	return (await axiosInstance.delete<CartDTO>('/cart/' + id)).data;
};

export const addCartItem = async (
	values: CreateCartItemValues
): Promise<CartDTO> => {
	return (await axiosInstance.post<CartDTO>('/cart', values)).data;
};
