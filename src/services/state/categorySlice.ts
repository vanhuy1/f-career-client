import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { AppStoreState, LoadingState } from '../../store/store.model';
import { Category, CategoryListResponse } from '@/types/Category';
import { categoryService } from '@/services/api/category/category-api';

const initialState: AppStoreState<CategoryListResponse> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    setCategorySuccess(state, action: PayloadAction<CategoryListResponse>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    setCategoryFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    clearCategoryErrors(state) {
      state.errors = null;
    },
  },
});

export const {
  setCategoryStart,
  setCategorySuccess,
  setCategoryFailure,
  clearCategoryErrors,
} = categorySlice.actions;

// Selectors
export const selectCategoryState = (state: RootState) => state.category;
export const selectCategories = (state: RootState) => state.category.data;
export const selectCategoryLoadingState = (state: RootState) =>
  state.category.loadingState;
export const selectCategoryErrors = (state: RootState) => state.category.errors;

// Hooks
export const useCategoryState = () => useAppSelector(selectCategoryState);
export const useCategories = () => useAppSelector(selectCategories);
export const useCategoryLoadingState = () =>
  useAppSelector(selectCategoryLoadingState);
export const useCategoryErrors = () => useAppSelector(selectCategoryErrors);

// Thunk to fetch categories
export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setCategoryStart());
    const categories = await categoryService.findAll();
    dispatch(setCategorySuccess(categories));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch categories';
    dispatch(setCategoryFailure(errorMessage));
  }
};

// Utility function to get category by ID
export const useCategoryById = (id: string): Category | undefined => {
  const categories = useCategories();
  return categories?.find((category: Category) => category.id === id);
};

export default categorySlice.reducer;
