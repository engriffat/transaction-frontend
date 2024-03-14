import { useState } from "react";
import DatePicker from "react-datepicker";

const rowsData = [
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
  {
    id: 1,
    address: "0x0001",
    date: "2023-01-01",
    amount1: "$100,000",
    amount2: "50",
    amount3: "30",
    amount4: "100",
    amount5: "80",
    amount6: "$20,000",
    amount7: "$15,000",
    amount8: "$1,000,000",
    amount9: "$10",
  },
];

const LivePair = () => {
  const [startDate, setStartDate] = useState(null);
  const [page, setPage] = useState(1);
  const [endDate, setEndDate] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const totalItems = count;

  const handleFieldChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const clearSelections = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleSearch = () => {
    getTransactions();
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, rowsData.length);

  return (
    <div className="container mx-auto p-4">
      <div className="-mx-4 overflow-x-auto flex flex-col gap-[50px]">
        <div className="flex  gap-2 justify-center items-center w-[100%] mt-4 bg-white rounded shadow-sm p-2">
          <input
            type="text"
            className="w-full border border-gray-300 py-[8px] rounded-lg px-[10px] outline-none"
            placeholder="Contract address"
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

          <div className="flex gap-2 justify-center items-center text-center w-3/5 ">
            <button
              onClick={handleSearch}
              className="btn btn-primary white-btn"
            >
              Submit
            </button>
            <button
              onClick={clearSelections}
              className="btn btn-primary white-btn"
            >
              Clear
            </button>
          </div>
        </div>
        <table className="min-w-full mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liquidity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No of Buys
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No of Sells
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No of Buyers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No of Sellers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buy Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sell Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rowsData.slice(startIndex, endIndex).map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap">{row.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount2}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount3}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount4}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount5}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount6}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount7}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount8}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.amount9}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rowsData.length > 0 && (
        <div className="tbl-pagination-wrapper py-8  shadow-md">
          <div className="pagination-limit-wrapper">
            <span>Show </span>
            <select value={pageSize} onChange={handleFieldChange}>
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
              disabled={page === Math.ceil(rowsData.length / pageSize)}
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
