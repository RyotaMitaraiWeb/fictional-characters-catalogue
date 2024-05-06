type RoleData = {
  id: number;
  name: string;
};

type role = 'user' | 'admin';

export const roles: Record<role, RoleData> = {
  user: {
    id: 1,
    name: 'User',
  },
  admin: {
    id: 2,
    name: 'Administrator',
  },
};
