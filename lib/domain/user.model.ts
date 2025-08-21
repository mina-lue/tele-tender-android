export interface User {
  id: string;
  email: string;
  name: string;
  role: 'VENDOR' | 'BUYER' | 'ADMIN';
}
