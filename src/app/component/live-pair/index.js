import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsBoxArrowUpRight, BsCopy } from "react-icons/bs";
import { LuLoader } from "react-icons/lu";
import ReactPaginate from "react-paginate";

import io from "socket.io-client"; // Import socket.io-client

const LivePair = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const socket = io("http://localhost:3003/"); // Initialize socket connection

  const [newToken, setNewToken] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transectionData, setTransectionData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // FILTER STATE
  const [contractAddress, setContractAddress] = useState("");
  const [fromLiquidity, setFromLiquidity] = useState("");
  const [toLiquidity, setToLiquidity] = useState("");
  const [fromBuyVolume, setFromBuyVolume] = useState("");
  const [toBuyVolume, setToBuyVolume] = useState("");
  const [fromSellVolume, setFromSellVolume] = useState("");
  const [toSellVolume, setToSellVolume] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  console.log("🚀 ~ LivePair ~ currentPage:", currentPage)
  const [pageCount, setPageCount] = useState(0);

  // Calculate the indexes of the items to be displayed on the current page
  const indexOfLastItem = (currentPage + 1) * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = transectionData.slice(indexOfFirstItem, indexOfLastItem);
  console.log("🚀 ~ LivePair ~ currentItems:", currentItems)

  // Change page
  const handlePageChange = ({ selected }) => {
    console.log("🚀 ~ handlePageChange ~ selected:", selected)
    setCurrentPage(selected+1);
  };

  const totalItems = newToken.length;

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

  useEffect(() => {
    const socketurl = io("http://localhost:3003/"); // Initialize socket connection

    socketurl.on("connection", () => {
      console.log("Socket connected");
    });
  }, []);

  useEffect(() => {
    socket.emit("getTokens", { limit: 10, page_number: currentPage });
    socket.on("tokensData", ({ tokens, count }) => {
      console.log("🚀 ~ socket.on ~ count:", count);
      setPageCount(count);
      console.log("inside tokenDara");
      console.log("Received tokens data:---", tokens);
      setIsLoading(false);
      setTransectionData(tokens);
    });
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/getNewToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_number: page || "",
          limit: pageSize || "",
          contract_address: contractAddress,
          form_liquadity: fromLiquidity,
          to_liquadity: toLiquidity,
          from_buy_volume: fromBuyVolume,
          to_buy_volume: toBuyVolume,
          from_sell_volume: fromSellVolume,
          to_sell_volume: toSellVolume,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch transaction data");
      }

      setNewToken(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [pageSize, page]);

  const handleFieldChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  // const handlePageChange = (newPage) => {
  //   setPage(newPage);
  // };

  const clearSelections = () => {
    setContractAddress("");
    setFromLiquidity("");
    setToLiquidity("");
    setFromBuyVolume("");
    setToBuyVolume("");
    setFromSellVolume("");
    setToSellVolume("");
    setStartDate(null);
    setEndDate(null);

    fetchData();
  };

  const handleSearch = () => {
    fetchData();
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, newToken.length);

  return (
    <div className="mx-auto p-4">
      <div className="-mx-4 overflow-x-auto flex flex-col gap-[50px]">
        {/* <div className="grid grid-cols-6 gap-2 w-[100%] mt-4 rounded shadow-sm p-2">
          <div className="col-span-5 grid grid-cols-4 gap-2">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none col-span-2"
              placeholder="Contract address"
            />
            <input
              type="text"
              value={fromLiquidity}
              onChange={(e) => setFromLiquidity(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="From Liquidity"
            />
            <input
              type="text"
              value={toLiquidity}
              onChange={(e) => setToLiquidity(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="To Liquidity"
            />
            <input
              type="text"
              value={fromBuyVolume}
              onChange={(e) => setFromBuyVolume(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="From Buy Volume"
            />
            <input
              type="text"
              value={toBuyVolume}
              onChange={(e) => setToBuyVolume(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="To Buy Volume"
            />
            <input
              type="text"
              value={fromSellVolume}
              onChange={(e) => setFromSellVolume(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="From Sell Volume"
            />
            <input
              type="text"
              value={toSellVolume}
              onChange={(e) => setToSellVolume(e.target.value)}
              className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
              placeholder="To Sell Volume"
            />
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={startDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date & Time"
              className=" px-4 py-2  border border-gray-300 rounded-md w-full"
            />
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date & Time"
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="flex flex-col gap-2 justify-center items-center text-center px-2 border">
            <button
              onClick={handleSearch}
              className="btn bg-black text-white white-btn w-full"
            >
              Submit
            </button>
            <button
              onClick={clearSelections}
              className="btn btn-primary white-btn  w-full"
            >
              Clear
            </button>
          </div>
        </div> */}

        <table className="w-full mx-auto bg-white shadow h-auto overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {[
                "volume(m5)",
                "volume(h1)",
                "volume(h6)",
                "volume(h24)",
                "txns buy(m5)",
                "txns sell(m5)",
                "txns buy(h1)",
                "txns sell(h1)",
                "txns buy(h6)",
                "txns sell(h6)",
                "txns buy(h24)",
                "txns sell(h24)",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-nowrap overflow-auto text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-black divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="12"
                  className="flex self-center justify-center items-center"
                >
                  <LuLoader
                    size={32}
                    className="animate-spin ease-out duration-2000"
                  />
                </td>
              </tr>
            ) : transectionData && transectionData.length > 0 ? (
              transectionData.map((data, index) => (
                <tr key={index} className=" text-black">
                  <td className="px-6 py-4">{data.volume[0]?.m5 || 0}</td>
                  <td className="px-6 py-4">{data.volume[0]?.h1 || 0}</td>
                  <td className="px-6 py-4">{data.volume[0]?.h6 || 0}</td>
                  <td className="px-6 py-4">{data.volume[0]?.h24 || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.m5?.buys || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.m5?.sells || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h1?.buys || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h1?.sells || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h6?.buys || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h6?.sells || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h24?.buys || 0}</td>
                  <td className="px-6 py-4">{data.txns[0]?.h24?.sells || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="flex justify-center items-center w-full"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination component */}
        <div className="flex justify-center mt-4">
          <ReactPaginate
            pageCount={Math.ceil(pageCount / 10)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
          />
        </div>
      </div>

      {/* {newToken.length > 0 && (
        <div className="tbl-pagination-wrapper py-8  shadow-md !bg-white">
          <div className="pagination-limit-wrapper">
            <span>Show </span>
            <select
              value={pageSize}
              onChange={handleFieldChange}
              className="w-14 rounded"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span> entries</span>
          </div>
          <div className="flex gap-5">
            <button
              className="cursor-pointer border-black border rounded py-1 px-2 font-semibold disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>{page}</span>
            <button
              className="cursor-pointer bg-black text-white px-2 py-1 rounded disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === Math.ceil(totalItems / pageSize)}
            >
              Next
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LivePair;
