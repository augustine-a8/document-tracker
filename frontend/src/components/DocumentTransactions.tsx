import { ITransaction } from "../@types/transaction";

interface DocumentTransactionsProps {
  transactions: ITransaction[];
  currentPage: number;
  maxItemsPerPage: number;
}

export default function DocumentTransactions({
  transactions,
  currentPage,
  maxItemsPerPage,
}: DocumentTransactionsProps) {
  return (
    <div className="w-full border rounded-[12px] overflow-hidden">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Sent At</th>
            <th>Acknowledged At</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item, idx) => {
            const {
              transactionId,
              comment,
              sentTimestamp,
              acknowledgedTimestamp,
              sender,
              receiver,
            } = item;
            return (
              <tr key={transactionId}>
                <td>{(currentPage - 1) * maxItemsPerPage + idx + 1}</td>
                <td data-cell="sender">{sender.name}</td>
                <td data-cell="receiver">{receiver.name}</td>
                <td data-cell="sent at">
                  {new Date(sentTimestamp).toUTCString()}
                </td>
                <td data-cell="acknowledged at">
                  {acknowledgedTimestamp
                    ? new Date(acknowledgedTimestamp).toUTCString()
                    : "n/a"}
                </td>
                <td data-cell="comment">{comment}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
