import { IArchiveTransaction } from "./archive";
import { INotification } from "./notification";

export interface IArchiveNotification extends INotification {
  transaction: IArchiveTransaction;
}
