export interface User {
  id: string;
  email: string;
  name: string;
  role: 'VENDOR' | 'BUYER' | 'ADMIN';
}

export interface UserRegistrationDto {
  name: string;
  email: string;
  password: string;
  urlToDoc?: string;
  sex?: 'male' | 'female';
  phone: string;
  role: 'VENDOR' | 'BUYER' ;
  approved: boolean;
}
