import { useEffect, useState } from "react";

import { getAllMailsApi } from "../../api/courier.api";
import { IMail } from "../../@types/mail";
import { IError } from "../../@types/error";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import { IMeta } from "../../@types/pagination";
import { getToday } from "../../lib/getToday.lib";

export default function Delivered() {
  const [deliveredMails, setDeliveredMails] = useState<IMail[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [date, setDate] = useState<string>(getToday());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    start: 0,
    end: 0,
  });

  useEffect(() => {
    setApiLoading(true);
    getAllMailsApi("delivered", start, limit, searchQuery, date)
      .then((res) => {
        if (res.status === 200) {
          setDeliveredMails(res.data.allDeliveredMails);
          setMeta(res.data.meta);
          return;
        }
        setApiError(res as IError);
      })
      .catch((err) => {
        setApiError(err as IError);
      })
      .finally(() => {
        setApiLoading(false);
      });
  }, [start, limit, searchQuery, date]);

  const goToPreviousPage = () => {
    if (start > limit) {
      setStart(start - limit);
    }
  };

  const goToNextPage = () => {
    if (meta.end === meta.total) {
      return;
    }
    setStart(start + limit);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setStart(1);
      setSearchQuery(search);
    }
  };

  if (apiLoading) {
    return <LoadingPage />;
  }

  if (apiError !== null) {
    return <ErrorPage message={apiError.data.message} />;
  }
  return (
    <>
      <div className="px-4 flex flex-row items-center justify-end h-14 border-b">
        <div className="flex flex-row items-center gap-4">
          <div>
            <label
              htmlFor="date"
              className="border rounded-md px-2 py-1 text-gray-500 h-8"
            >
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                className="border-none outline-none text-sm"
              />
            </label>
          </div>
          <div
            className={`flex flex-row items-center ${
              searchFocus ? "border-2" : "border"
            } ${
              searchFocus ? "border-gray-600" : "border-gray-300"
            } rounded-md px-2 text-gray-500 h-8`}
          >
            <input
              type="text"
              placeholder="Search for mail"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="flex-1 outline-none border-none text-sm"
              onFocus={() => {
                setSearchFocus(true);
              }}
              onBlur={() => {
                setSearchFocus(false);
              }}
              onKeyDown={handleSearch}
            />
            <CiSearch />
          </div>
        </div>
      </div>
      {deliveredMails.length > 0 ? (
        <div>
          <div className="w-full flex flex-row items-center justify-end gap-2 px-4 py-2">
            <div className="flex flex-row items-center gap-2 text-xs text-gray-400">
              <div className="flex flex-row items-center gap-2">
                <label htmlFor="show">Show</label>
                <div className="border px-1 py-1 rounded-md w-8 overflow-hidden">
                  <input
                    type="text"
                    name="show"
                    id="show"
                    max={meta.total}
                    min={1}
                    value={limit}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        return;
                      }
                      const l = parseInt(e.target.value, 10);
                      if (l < 1 || l > meta.total) {
                        return;
                      }
                      setLimit(l);
                    }}
                    className="outline-none border-none"
                  />
                </div>
              </div>
              <p>
                {meta.start} - {meta.end} of {meta.total}
              </p>

              <div
                className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                role="button"
                onClick={goToPreviousPage}
              >
                <MdChevronLeft color="#463f3a" />
              </div>
              <div
                className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                role="button"
                onClick={goToNextPage}
              >
                <MdChevronRight color="#463f3a" />
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="w-full border rounded-[12px] overflow-hidden">
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Reference number</th>
                    <th>Date</th>
                    <th>Addressee</th>
                    <th>Driver</th>
                    <th>Recipient</th>
                    <th>Recipient contact</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredMails.map((mail, idx) => (
                    <tr key={idx}>
                      <td>{start + idx}</td>
                      <td>{mail.referenceNumber}</td>
                      <td>{new Date(mail.date).toUTCString()}</td>
                      <td>{mail.addressee}</td>
                      <td>{mail.driver?.name}</td>
                      <td>{mail.receipient}</td>
                      <td>{mail.receipientContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <EmptyPage
          message={`No delivered mails for ${new Date(date).toDateString()}!`}
        />
      )}
    </>
  );
}
