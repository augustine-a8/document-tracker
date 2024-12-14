import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

import {
  getAllMailsApi,
  addMailApi,
  dispatchMailApi,
} from "../../api/courier.api";
import { IMail } from "../../@types/mail";
import { IError } from "../../@types/error";
import { useAuth } from "../../hooks/useAuth";
import AddMail from "./AddMail";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import DispatchMail from "../../components/DispatchMail";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import { IMeta } from "../../@types/pagination";
import { getToday } from "../../lib/getToday.lib";

export default function AllMails() {
  const [pendingMails, setPendingMails] = useState<IMail[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [openAddMail, setOpenAddMail] = useState<boolean>(false);
  const [openDispatchMail, setOpenDispatchMail] = useState<boolean>(false);
  const [mailsToDispatch, setMailsToDispatch] = useState<string[]>([]);
  const [dispatchMailApiLoading, setDispatchMailApiLoading] =
    useState<boolean>(false);
  const [dispatchMailApiError, setDispatchMailApiError] =
    useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [date, setDate] = useState<string>(getToday());
  const [start, setStart] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    start: 0,
    end: 0,
  });

  const { getMyAccount } = useAuth();
  const myAccount = getMyAccount();

  const handleAddMail = (referenceNumber: string, addressee: string) => {
    addMailApi(referenceNumber, addressee)
      .then((res) => {
        if (res.status === 200) {
          setPendingMails((prev) => [...prev, res.data.mail]);
          return;
        }
        setApiError(apiError);
      })
      .catch((err) => {
        setApiError(err);
      });
  };

  const dispatchMail = (driverId: string) => {
    setDispatchMailApiLoading(true);
    dispatchMailApi(driverId, mailsToDispatch)
      .then((res) => {
        if (res.status === 200) {
          setPendingMails((prev) =>
            prev.filter(
              (mail) => !res.data.successfulDispatches.includes(mail.mailId)
            )
          );
          setOpenDispatchMail(false);
          return;
        }
        setDispatchMailApiError(res as IError);
      })
      .catch((err) => {
        setDispatchMailApiError(err);
      })
      .finally(() => {
        setDispatchMailApiLoading(false);
      });
  };

  const toggleCheckAll = () => {
    if (mailsToDispatch.length === 0) {
      setMailsToDispatch(pendingMails.map((mail) => mail.mailId));
    } else {
      setMailsToDispatch([]);
    }
  };

  useEffect(() => {
    setApiLoading(true);
    getAllMailsApi("pending", start, limit, searchQuery, date)
      .then((res) => {
        if (res.status === 200) {
          setPendingMails(res.data.allPendingMails);
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
      <div className="px-4 flex flex-row items-center justify-between h-14 border-b">
        {myAccount?.role === "registrar" ? (
          <button
            onClick={() => {
              setOpenAddMail(true);
            }}
          >
            <div className="border border-[#023e8a] rounded-md h-8 px-4 flex items-center text-[#023e8a] hover:bg-[#023e8a] hover:text-white">
              <p>Add mail</p>
            </div>
          </button>
        ) : (
          <div></div>
        )}
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
      {pendingMails.length > 0 ? (
        <>
          <div className="w-full flex flex-row items-center justify-between my-2 px-4">
            <div>
              {mailsToDispatch.length > 0 ? (
                <button
                  onClick={() => {
                    setOpenDispatchMail(true);
                  }}
                >
                  <div className="h-8 w-32 text-white rounded-md bg-green-600 hover:opacity-80 duration-300 flex flex-row gap-2 justify-center items-center text-sm">
                    <BsFillSendFill />
                    <p>Dispatch</p>
                  </div>
                </button>
              ) : undefined}
            </div>
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
          </div>
          <div className="px-4">
            <div className="w-full border rounded-[12px] overflow-hidden">
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Reference Number</th>
                    <th>Date</th>
                    <th>Addressee</th>
                    <th>
                      <div className="h-8 w-8 rounded-full grid place-items-center hover:cursor-pointer hover:bg-gray-300">
                        <input
                          className="hover:cursor-pointer"
                          type="checkbox"
                          name="check-all"
                          id=""
                          onChange={() => {
                            toggleCheckAll();
                          }}
                          checked={
                            mailsToDispatch.length === pendingMails.length
                          }
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="highlight">
                  {pendingMails.map((mail, idx) => (
                    <tr key={idx}>
                      <td>{start + idx}</td>
                      <td>{mail.referenceNumber}</td>
                      <td>{new Date(mail.date).toUTCString()}</td>
                      <td>{mail.addressee}</td>
                      <td>
                        <div className="h-8 w-8 rounded-full grid place-items-center hover:cursor-pointer hover:bg-gray-300">
                          <input
                            type="checkbox"
                            className="hover:cursor-pointer"
                            checked={mailsToDispatch.includes(mail.mailId)}
                            id={`checkbox-${idx}`}
                            onChange={(e) => {
                              e.stopPropagation();
                              mailsToDispatch.includes(mail.mailId)
                                ? setMailsToDispatch((prev) =>
                                    prev.filter(
                                      (mailId) => mailId !== mail.mailId
                                    )
                                  )
                                : setMailsToDispatch((prev) => [
                                    ...prev,
                                    mail.mailId,
                                  ]);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyPage message={`No mails for ${new Date(date).toDateString()}!`} />
      )}
      <AddMail
        isOpen={openAddMail}
        closeModal={() => {
          setOpenAddMail(false);
        }}
        handleAddMail={handleAddMail}
      />
      <DispatchMail
        isOpen={openDispatchMail}
        closeModal={() => {
          setOpenDispatchMail(false);
        }}
        mailsToDispatchCount={mailsToDispatch.length}
        dispatchMail={dispatchMail}
        apiLoading={dispatchMailApiLoading}
        apiError={dispatchMailApiError}
      />
    </>
  );
}
