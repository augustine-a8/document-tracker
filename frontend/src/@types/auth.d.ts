import { IUser } from "./user";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (u: IUser) => void;
  logout: () => void;
  getMyAccount: () => IUser | undefined;
}
