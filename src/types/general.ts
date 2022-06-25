export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type Nullable<T> = { [K in keyof T]: T[K] | null };
