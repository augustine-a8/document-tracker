import { useEffect, useState } from "react";
import { getAllDriversApi } from "../../api/courier.api";
import { IDriver } from "../../@types/mail";
import { IMeta } from "../../@types/pagination";
import { IError } from "../../@types/error";
import { CiSearch } from "react-icons/ci";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import AddDriver from "./AddDriver";
import { useNavigate } from "react-router-dom";

export default function Drivers() {
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    start: 0,
    end: 0,
  });
  const [addDriverIsOpen, setAddDriverIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const openAddDriver = () => {
    setAddDriverIsOpen(true);
  };

  const closeAddDriver = () => {
    setAddDriverIsOpen(false);
  };

  useEffect(() => {
    setApiLoading(true);
    getAllDriversApi(start, limit, searchQuery)
      .then((res) => {
        if (res.status === 200) {
          setDrivers(res.data.drivers);
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
  }, [start, limit, searchQuery]);

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

  const goToDriverDetails = (driverId: string) => {
    navigate(`${driverId}`);
  };

  if (apiLoading) {
    return <LoadingPage />;
  }

  if (apiError !== null) {
    return <ErrorPage message={apiError.data.message} />;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between h-14 px-4 border-b">
        <div>
          <button onClick={openAddDriver}>
            <div className="border border-[#023e8a] rounded-md h-8 px-4 flex items-center bg-[#023e8a] text-white hover:cursor-pointer hover:opacity-80 duration-300">
              <p>Add driver</p>
            </div>
          </button>
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
            placeholder="Search for driver"
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
      {drivers.length > 0 ? (
        <>
          {" "}
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
                    <th>Name</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        goToDriverDetails(driver.driverId);
                      }}
                    >
                      <td>{start + idx}</td>
                      <td>{driver.name}</td>
                      <td>{driver.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyPage message="No driver available!" />
      )}
      <AddDriver isOpen={addDriverIsOpen} closeModal={closeAddDriver} />
    </>
  );
}
