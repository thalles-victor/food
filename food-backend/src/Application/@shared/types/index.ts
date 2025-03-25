import { ROLE } from '../metadata';

export type PayloadType = {
  sub: string;
  roles: ROLE[];
  deletedAt: Date | null;
};
