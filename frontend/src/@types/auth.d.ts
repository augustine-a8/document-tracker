export interface AuthContextType {
  isAuthenticated: boolean;
  token: string;
  login: (token: string) => void;
  logout: () => void;
}
