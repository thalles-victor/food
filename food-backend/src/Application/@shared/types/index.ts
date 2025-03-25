import { ROLE } from '../metadata';

export type PayloadType = {
  sub: string;
  roles: ROLE[];
  deletedAt: Date | null;
};

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys];
