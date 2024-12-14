import {
  IActiveDocTransaction,
  INewActiveDocTransaction,
} from "../@types/activeDoc";

interface DocumentTransactionsProps {
  transactions: INewActiveDocTransaction[];
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
            {/* <th>#</th> */}
            <th>Source</th>
            <th>Forwarded to</th>
            <th>Date</th>
            <th>Action</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, idx) => {
            const { transactionId, source, forwardedTo, stateHistories } =
              transaction;
            return stateHistories.map((stateHistory) => {
              const { date, state, comment } = stateHistory;
              return (
                <tr key={transactionId}>
                  {/* <td>{(currentPage - 1) * maxItemsPerPage + idx + 1}</td> */}
                  <td data-cell="source">{source.name}</td>
                  <td data-cell="forward to">{forwardedTo.name}</td>
                  <td>{new Date(date).toISOString()}</td>
                  <td>{state}</td>
                  <td data-cell="comments">{comment}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
