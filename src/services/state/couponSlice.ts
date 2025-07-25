import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  couponService,
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
} from '../api/coupons/coupon-api';

interface CouponState {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  selectedCoupon: null,
  loading: false,
  error: null,
};

export const fetchCoupons = createAsyncThunk('coupons/fetchAll', async () => {
  return await couponService.findAll();
});

export const fetchCouponById = createAsyncThunk(
  'coupons/fetchById',
  async (id: number) => {
    return await couponService.findById(id);
  },
);

export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (dto: CreateCouponDto) => {
    return await couponService.create(dto);
  },
);

export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, dto }: { id: number; dto: UpdateCouponDto }) => {
    return await couponService.update(id, dto);
  },
);

export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id: number) => {
    await couponService.delete(id);
    return id;
  },
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      // Fetch single coupon
      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCoupon = action.payload;
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupon';
      })
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create coupon';
      })
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        if (state.selectedCoupon?.id === action.payload.id) {
          state.selectedCoupon = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update coupon';
      })
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
        if (state.selectedCoupon?.id === action.payload) {
          state.selectedCoupon = null;
        }
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete coupon';
      });
  },
});

export const { clearSelectedCoupon, clearError } = couponSlice.actions;
export default couponSlice.reducer;
