export interface AuthModel {
  isAuthenticated: boolean;
  token: string;
  expiresOn: string;
  username: string;
  email: string;
  roles: string[];
  massege: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}
