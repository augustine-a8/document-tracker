import { useEffect, useState } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IDriver, IMail } from "../../@types/mail";
import { IError } from "../../@types/error";
import { getDriverByIdApi, getMailsForDriverApi } from "../../api/courier.api";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { FaUserCircle } from "react-icons/fa";
import { IMeta } from "../../@types/pagination";
import { CiSearch } from "react-icons/ci";
import Status from "../../components/status";
import { getToday } from "../../lib/getToday.lib";
import EmptyPage from "../../components/EmptyPage";

export default function DriverDetails() {
  const [driver, setDriver] = useState<IDriver | null>(null);
  const [driverApiLoading, setDriverApiLoading] = useState<boolean>(false);
  const [driverApiError, setDriverApiError] = useState<IError | null>(null);

  const { driverId } = useParams();

  useEffect(() => {
    const fetchDriverById = () => {
      setDriverApiLoading(true);
      getDriverByIdApi(driverId)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.driver);
            setDriver(res.data.driver);
            return;
          }
          setDriverApiError(res as IError);
        })
        .catch((err) => {
          setDriverApiError(err as IError);
        })
        .finally(() => {
          setDriverApiLoading(false);
        });
    };

    fetchDriverById();
  }, []);

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/courier/drivers/");
  };

  if (driver === null) {
    return;
  }

  return (
    <>
      <div className="w-full px-4 mt-2" onClick={goBack}>
        <button className="w-fit flex flex-row gap-2 items-center text-sm text-[#023e8a] hover:underline">
          <MdOutlineArrowBackIosNew />
          <p>Back</p>
        </button>
      </div>
      {driverApiLoading ? (
        <LoadingPage />
      ) : driverApiError !== null ? (
        <ErrorPage message={driverApiError.data.message} />
      ) : (
        <div className="w-full grid grid-cols-2 border-b">
          <div className="px-4 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p className="lg-regular text-gray-500 text-sm">Name</p>
                <p>{driver.name}</p>
              </div>
              <div>
                <p className="lg-regular text-gray-500 text-sm">Contact</p>
                <p>{driver.contact}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="text-gray-500 w-full h-full grid place-items-center">
              <FaUserCircle size={60} />
            </div>
          </div>
        </div>
      )}
      <div className="my-4">
        <MailsForDriver driverId={driverId} />
      </div>
    </>
  );
}

interface IMailsForDriverProps {
  driverId: string | undefined;
}

function MailsForDriver({ driverId }: IMailsForDriverProps) {
  const [deliveries, setDeliveries] = useState<IMail[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [date, setDate] = useState<string>(getToday());
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    start: 0,
    end: 0,
  });

  useEffect(() => {
    const fetchMailsForDriver = () => {
      setApiLoading(true);
      getMailsForDriverApi(driverId, start, limit, searchQuery, date)
        .then((res) => {
          if (res.status === 200) {
            setDeliveries(res.data.deliveries);
            setMeta(res.data.meta);
            return;
          }
          setApiError(res as IError);
        })
        .catch((err) => {
          setApiError(err);
        })
        .finally(() => {
          setApiLoading(false);
        });
    };

    fetchMailsForDriver();
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
      <div className="flex flex-row items-center justify-between px-4">
        <div className="flex flex-row items-center gap-4">
          <div
            className={`flex flex-row items-center ${
              searchFocus ? "border-2" : "border"
            } ${
              searchFocus ? "border-gray-600" : "border-gray-300"
            } rounded-md px-2 text-gray-500 h-8`}
          >
            <input
              type="text"
              placeholder="Search delivery"
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
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-2 px-4">
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
      {deliveries.length > 0 ? (
        <div className="px-4 my-4">
          <div className="w-full border rounded-[12px] overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th>Reference Number</th>
                  <th>Date</th>
                  <th>Addressee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr>
                    <td>{delivery.referenceNumber}</td>
                    <td>{new Date(delivery.date).toUTCString()}</td>
                    <td>{delivery.addressee}</td>
                    <td>
                      <Status
                        status={delivery.status}
                        color={
                          delivery.status === "pending"
                            ? "yellow"
                            : delivery.status === "transit"
                            ? "blue"
                            : delivery.status === "delivered"
                            ? "green"
                            : "red"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyPage
          message={`No deliveries on ${new Date(date).toDateString()}`}
        />
      )}
    </>
  );
}
