export type AuthUser = {
  sub: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
};
