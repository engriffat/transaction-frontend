import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCopy } from "react-icons/bs";
import { LuLoader } from "react-icons/lu";

const LivePair = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [newToken, setNewToken] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const totalItems = newToken.length;

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
        <div className="grid grid-cols-6 gap-2 w-[100%] mt-4 rounded shadow-sm p-2">
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
        </div>

        <table className="w-full mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Contract Address",
                "Pair Address",
                "Created Date",
                "Liquidity",
                "No of Buys",
                "No of Sells",
                "No of Buyers",
                "No of Sellers",
                "Buy Volume",
                "Sell Volume",
                "Market Cap",
                "Price",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <LuLoader
                  size={32}
                  className="animate-spin ease-out duration-2000"
                />
              </div>
            ) : newToken && newToken.length > 0 ? (
              newToken.slice(startIndex, endIndex).map((data) => (
                <tr key={data.id}>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => copyToClipboard(data?.contract_address)}
                  >
                    {`${data?.contract_address.slice(
                      0,
                      4
                    )}...${data?.contract_address.slice(38, 42)}`}{" "}
                    <BsCopy className="inline-icon" />
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => copyToClipboard(data?.pair_address)}
                  >
                    {`${data?.pair_address.slice(
                      0,
                      4
                    )}...${data?.pair_address.slice(38, 42)}`}{" "}
                    <BsCopy className="inline-icon" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {moment(data.createdAt).format("lll")}
                  </td>
                  <td className="px-6 py-4 ">{data.liquidity}</td>
                  <td className="px-6 py-4 ">{data.number_of_buyer}</td>
                  <td className="px-6 py-4 ">{data.number_of_seller}</td>
                  <td className="px-6 py-4 ">{data.number_of_buyer}</td>
                  <td className="px-6 py-4 ">{data.number_of_seller}</td>
                  <td className="px-6 py-4 ">{data.buy_volume}</td>
                  <td className="px-6 py-4 ">{data.sell_volume}</td>
                  <td className="px-6 py-4 ">{data.market_cap}</td>
                  <td className="px-6 py-4 ">{data.price}</td>
                </tr>
              ))
            ) : (
              <span className="flex justify-center items-center w-full">
                No data
              </span>
            )}
          </tbody>
        </table>
      </div>

      {newToken.length > 0 && (
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
      )}
    </div>
  );
};

export default LivePair;
