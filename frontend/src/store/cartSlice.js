import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await api.getCart();
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addItemToCart = createAsyncThunk('cart/addItem', async (itemData, { dispatch, rejectWithValue }) => {
    try {
        await api.addToCart(itemData);
        dispatch(fetchCart()); // Refresh cart
    } catch (err) {
         return rejectWithValue(err.response.data);
    }
});

export const updateItemQuantity = createAsyncThunk('cart/updateItem', async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
        await api.updateCartItem(id, { quantity });
        dispatch(fetchCart());
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const removeItem = createAsyncThunk('cart/removeItem', async (id, { dispatch, rejectWithValue }) => {
    try {
        await api.removeFromCart(id);
        dispatch(fetchCart());
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
        isOpen: false, // For controlling the sidebar/drawer
        loading: false,
        error: null,
    },
    reducers: {
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.total_price;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { toggleCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
