export enum LoadingState {
  loaded = 'loaded',
  loading = 'loading',
  init = 'init',
  error = 'error',
}

export interface AppStoreState<T> {
  data: T | null;
  loadingState: LoadingState;
  errors: string | null;
}
