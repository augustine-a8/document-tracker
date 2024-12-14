import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { PiDotOutlineFill } from "react-icons/pi";

import { getMailByIdApi } from "../api/courier.api";
import { IMail, IMaliLog } from "../@types/mail";

export default function MailDetails() {
  const [mail, setMail] = useState<IMail>();
  const [mailLogs, setMailLogs] = useState<IMaliLog[]>([]);
  const { mailId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMailById = () => {
      getMailByIdApi(mailId!).then((res) => {
        if (res.status === 200) {
          setMail(res.data.mail);
          setMailLogs(res.data.mail.mailLogs);
        }
      });
    };

    fetchMailById();
  }, []);

  const goBack = () => {
    navigate("/courier");
  };

  return (
    <>
      <div className="w-full px-4 mt-2" onClick={goBack}>
        <button className="w-fit flex flex-row gap-2 items-center text-sm text-[#023e8a] hover:underline">
          <MdOutlineArrowBackIosNew />
          <p>Back</p>
        </button>
      </div>
      <div className="px-4 py-2">
        <div className="grid grid-cols-[80%,1fr]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Reference number</p>
              <p className="lb-regular ">{mail?.referenceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Addressed to</p>
              <p className="lb-regular">{mail?.addressee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="lb-regular">
                {new Date(mail?.date!).toUTCString()}
              </p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="border rounded-[12px] overflow-hidden w-full">
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Status</th>
                  <th>Updated At</th>
                  <th>Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {mailLogs.map((mailLog, idx) => {
                  const { mailLogId, status, updatedAt } = mailLog;
                  return (
                    <tr key={mailLogId}>
                      <td data-cell="s/n">{idx + 1}</td>

                      <td data-cell="mail log id">{mailLogId}</td>
                      <td data-cell="updated at">
                        {new Date(updatedAt).toUTCString()}
                      </td>

                      <td data-cell="status">
                        <div
                          className={`rounded-full h-6 w-fit pl-2 pr-4 flex flex-row items-center gap-1 justify-center ${
                            status === "pending"
                              ? " text-yellow-500 bg-yellow-100"
                              : status === "delivered"
                              ? "text-green-400 bg-green-100"
                              : " text-blue-500 bg-blue-100"
                          }`}
                        >
                          <PiDotOutlineFill className="text-xl" />
                          <p className="text-xs capitalize">{status}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
