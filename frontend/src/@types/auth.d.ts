export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  myAccount: IUser;
  setMyAccount: (me: IUser) => void;
}
