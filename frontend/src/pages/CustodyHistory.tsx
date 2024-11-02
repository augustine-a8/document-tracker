import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { getAllCustodyHistoryApi } from "../api/history.api";
import { useAuth } from "../hooks/useAuth";
import { IHistory } from "../@types/history";
import { IError } from "../@types/error";

export default function CustodyHistory() {
  const { token } = useAuth();
  const [allHistory, setAllHistory] = useState<IHistory[]>([]);
  const [error, setError] = useState<IError | null>(null);

  useEffect(() => {
    const fetchAllCustodyHistory = () => {
      getAllCustodyHistoryApi(token)
        .then((res) => {
          if (res.status === 200) {
            setAllHistory(res.data.allHistory);
          }
        })
        .catch((err) => {
          setError(err);
        });
    };

    fetchAllCustodyHistory();
  }, []);

  return (
    <main>
      <div className="pagination">
        <p>1 - 50 of 3,269</p>
        <div className="page-prev" role="button">
          <MdChevronLeft color="#463f3a" />
        </div>
        <div className="page-next" role="button">
          <MdChevronRight color="#463f3a" />
        </div>
      </div>
      <table className="document-table">
        <thead>
          <tr>
            <th>
              # <div></div>
            </th>
            <th>Title</th>
            <th>Type</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Sent At</th>
            <th>Acknowledged At</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {allHistory.map((item, idx) => {
            const {
              historyId,
              comment,
              sender,
              document,
              receiver,
              sentTimestamp,
              acknowledgedTimestamp,
            } = item;
            return (
              <tr key={historyId}>
                <td>{idx + 1}</td>
                <td>{document.title}</td>
                <td>{document.type}</td>
                <td>{sender.name}</td>
                <td>{receiver.name}</td>
                <td>{new Date(sentTimestamp).toDateString()}</td>
                <td>
                  {acknowledgedTimestamp
                    ? new Date(acknowledgedTimestamp).toDateString()
                    : "n/a"}
                </td>
                <td>{comment}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
