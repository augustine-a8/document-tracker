import { IActiveDocTransaction, INewActiveDocTransaction } from "./activeDoc";
import { INotification } from "./notification";

export interface IActiveDocNotification extends INotification {
  transaction: INewActiveDocTransaction;
}
