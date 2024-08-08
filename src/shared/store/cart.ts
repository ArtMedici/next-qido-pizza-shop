import { getCartDetails } from '@/shared/lib';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { Api } from '@/shared/services/api-client';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { create } from 'zustand';

export interface CartState {
	loading: boolean;
	error: boolean;
	totalAmount: number;
	items: CartStateItem[];
	fetchCartItems: () => Promise<void>;
	updateItemQuantity: (id: number, quantity: number) => Promise<void>;
	addCartItem: (values: any) => Promise<void>;
	removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	error: false,
	loading: true,
	totalAmount: 0,

	fetchCartItems: async () => {
		try {
			set({ loading: true, error: false });
			const data = await Api.cart.getCart();
			set(getCartDetails(data));
		} catch (error) {
			console.error(error);
			set({ error: true });
		} finally {
			set({ loading: false });
		}
	},
	updateItemQuantity: async (id: number, quantity: number) => {
		try {
			set({ loading: true, error: false });
			const data = await Api.cart.updateItemQuantity(id, quantity);
			set(getCartDetails(data));
		} catch (error) {
			console.error(error);
			set({ error: true });
		} finally {
			set({ loading: false });
		}
	},
	addCartItem: async (values: CreateCartItemValues) => {
		try {
			set({ loading: true, error: false });
			const data = await Api.cart.addCartItem(values);
			set(getCartDetails(data));
		} catch (error) {
			console.error(error);
			set({ error: true });
		} finally {
			set({ loading: false });
		}
	},
	removeCartItem: async (id: number) => {
		try {
			set((state) => ({
				loading: true,
				error: false,
				items: state.items.map((item) =>
					item.id === id ? { ...item, disabled: true } : item
				),
			}));
			const data = await Api.cart.removeCartItem(id);
			set(getCartDetails(data));
		} catch (error) {
			console.error(error);
			set({ error: true });
		} finally {
			set((state) => ({
				loading: false,
				items: state.items.map((item) => ({ ...item, disabled: false })),
			}));
		}
	},
}));
