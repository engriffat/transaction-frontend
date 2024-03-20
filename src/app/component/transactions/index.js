"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import { BsBoxArrowInUpRight, BsCopy } from "react-icons/bs";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsArrowRightSquareFill } from "react-icons/bs";
import moment from "moment";
import { LuLoader } from "react-icons/lu";

const tableHeaders = [
  "Transaction ID",
  "From Address",
  "To Address",
  "Gas",
  "Value",
  "Status",
  "Transaction Hash",
  "Created At",
];

export default function TransactionsComponent() {
  const [transactions, setTransactions] = useState([]);
  const [calculation, setCalculations] = useState([]);
  const [volume, setVolume] = useState({});
  const [buyVolume, setBuyVolume] = useState({});
  const [sellVolume, setSellVolume] = useState({});
  const [netVolume, setNetVolume] = useState();
  const [count, setCount] = useState(0);

  const totalItems = count;

  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [filterTime, setFilterTime] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [telegramModal, setTelegramModal] = useState(false);
  const [allContractAddresses, setallContractAddresses] = useState([]);
  const [SelectedcontractAddress, setcontractAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [tableLoader, setTableLoader] = useState(true);

  const [contractKey, setContactkey] = useState("");

  // FILTER States
  const [status, setStatus] = useState("");
  const [filterTxHash, setFilterTxHash] = useState("");
  const [filterVolume, setFilterVolume] = useState("");
  const [gasFrom, setGasFrom] = useState("");
  const [gasTo, setGasTo] = useState("");
  const [valueFrom, setValueFrom] = useState("");
  const [valueTo, setValueTo] = useState("");

  // TELEGRAM ALERT STATES
  const [fieldName, setFieldName] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  // Sorting function
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortedField) {
      const compareResult = a[sortedField].localeCompare(b[sortedField]);
      return sortOrder === "asc" ? compareResult : -compareResult;
    }
    return 0;
  });

  // Filtering function
  // const filterTransactions = () => {
  //   return sortedTransactions.filter((tx) => {
  //     const txDate = new Date(tx.createdAt); // Assuming createdAt is the property containing transaction time
  //     const isWithinDateRange =
  //       (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);
  //     const matchesTxHash = tx.transaction_hash.includes(filterTxHash);
  //     const matchesContractAddress =
  //       SelectedcontractAddress === "" ||
  //       tx.contract_address.includes(SelectedcontractAddress);
  //     return isWithinDateRange && matchesTxHash && matchesContractAddress;
  //   });
  // };

  // Function to handle click on action (Open modal)
  const handleActionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen1(true);
  };

  // Function to open add contract modal
  const openContractModal = () => {
    setIsModalOpen2(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen1(false);
  };

  const closeContractModal = () => {
    setIsModalOpen2(false);
  };

  // Function to clear date selection
  const clearSelections = () => {
    setFilterTxHash("");
    setStartDate(null);
    setEndDate(null);
    setSortOrder("");
    setSortedField("");
    setcontractAddress("");

    setTransactions("");
    setCount("");
    setVolume("");
    setBuyVolume("");
    setSellVolume("");
    setNetVolume("");
    setCalculations("");

    getTransactions();
  };

  // const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

  // On selecting the contract address
  const handleContractAddress = (value) => {
    setcontractAddress(value);
    console.log(SelectedcontractAddress);
  };

  const handleContractAddressChange = (event) => {
    setContractAddress(event.target.value);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/getContract`);
      const result = await response.json();
      const addresses = result.data.map((item) => item.contract_address);
      setallContractAddresses(addresses);
      setContactkey(addresses[0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const getTransactions = async () => {
    setTableLoader(true);
    try {
      const response = await fetch(`${apiUrl}/api/getTransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contract_address: contractKey || "",
          from_date: startDate || "",
          from_gas: gasFrom || "",
          from_value: valueFrom || "",
          hash: filterTxHash || "",
          limit: pageSize || "",
          page_number: page || "",
          status: status || "",
          to_date: endDate || "",
          to_gas: gasTo || "",
          to_value: valueTo || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction data");
      }

      const data = await response.json();
      setTransactions(data.data);
      setCount(data.count);
      setVolume(data.vloume);
      setBuyVolume(data.buy_volume);
      setSellVolume(data.sell_volume);
      setNetVolume(data.net_volume || 0);
      setCalculations(data.calculation);
      setTableLoader(false);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }

    setTableLoader(false);
  };

  useEffect(() => {
    getTransactions();
  }, [pageSize, page, contractKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/addContract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contract_address: contractAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add contract address");
      }

      const data = await response.json();
      toast.success(data.Message);
      setContractAddress("");
      fetchData();
      setIsModalOpen2(false);
    } catch (error) {
      toast.error("Error adding contract address:", error);
    }
  };

  const handleSearch = () => {
    getTransactions();
  };

  const handleFieldChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // TELEGRAM API
  const handleTELEGRAMSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/addTelegram_alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field_name: fieldName,
          from_value: fromValue,
          to_value: toValue,
          contract_address: contractAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData.message); // Log success message

      // Clear form fields after successful submission
      setFieldName("");
      setFromValue("");
      setToValue("");
      setContractAddress("");
    } catch (error) {
      console.error(error); // Log error message
    }
  };

  return (
    <main className="mx-auto text-black container-fluid h-screen !bg-white">
      <ToastContainer />

      <div className="flex flex-col gap-3 bg-[#fafafa] h-full">
        <div className="grid grid-cols-4 mt-4 bg-white rounded shadow-sm p-2 gap-4">
          {/* Filter Inputs */}
          <div className="col-span-3 gap-2 h-full  grid sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              placeholder="Search by TX Hash"
              value={filterTxHash}
              onChange={(e) => setFilterTxHash(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-100 h-[40px] col-span-2"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="status"
              className="p-2 border border-gray-300 rounded-md w-100 h-[40px]"
            >
              <option selected disabled value="">
                status
              </option>
              <option value="Pending">pending</option>
              <option value={"completed"}>completed</option>
            </select>
            {/* <input
              type="text"
              value={filterVolume}
              onChange={(e) => setFilterVolume(e.target.value)}
              placeholder="Volume"
              className="p-2 border border-gray-300 rounded-md w-100 h-[40px]"
            /> */}
            <div className="flex flex-col gap-2 justify-center items-center p-2 border border-gray-300 rounded-md">
              <span>Date Range</span>
              <div className="flex justify-between gap-4">
                <DatePicker
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mmaa"
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date & Time"
                  className=" px-4 py-2 border border-gray-300 rounded-md w-100"
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
                  className="px-4 py-2 border border-gray-300 rounded-md w-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center p-2 border border-gray-300 rounded-md">
              <span>GAS</span>
              <div className="flex justify-between gap-4">
                <input
                  value={gasFrom}
                  onChange={(e) => setGasFrom(e.target.value)}
                  placeholder="from"
                  className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                />
                <input
                  value={gasTo}
                  onChange={(e) => setGasTo(e.target.value)}
                  placeholder="to"
                  className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center p-2 border border-gray-300 rounded-md">
              <span>VALUE</span>
              <div className="flex justify-between gap-4">
                <input
                  value={valueFrom}
                  onChange={(e) => setValueFrom(e.target.value)}
                  placeholder="from"
                  className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                />
                <input
                  value={valueTo}
                  onChange={(e) => setValueTo(e.target.value)}
                  placeholder="to"
                  className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="grid xl:grid-cols-2 gap-2 justify-center items-center text-center border rounded p-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSearch}
                className="btn btn-primary white-btn w-full h-[50px]"
              >
                Apply Filters
              </button>
              <button
                onClick={clearSelections}
                className="btn btn-primary white-btn h-[50px]"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={openContractModal}
                className="btn btn-primary w-full h-[50px] colored-btn"
              >
                Add Contract Address
              </button>
              <button
                onClick={() => setTelegramModal(true)}
                className="btn btn-primary w-full h-[50px] colored-btn"
              >
                Add Telegram Alerts
              </button>
            </div>
          </div>
        </div>

        <div className="flex  gap-2 w-full h-full mb-4">
          {/* Left Side */}
          <div className="border w-[40%] flex flex-col gap-2 bg-[#ffff] p-2 rounded shadow ">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <LuLoader
                  size={32}
                  className="animate-spin ease-out duration-2000"
                />
              </div>
            ) : allContractAddresses.length > 0 ? (
              allContractAddresses.map((key, value) => (
                <div
                  key={value}
                  className={`bg-[#fafafa] p-2 rounded shadow-sm cursor-pointer truncate address-box hover:bg-[#0a0a0a] ${
                    contractKey === key ? "text-white bg-black" : "text-black "
                  }`}
                  value={key}
                  onClick={() => setContactkey(key)}
                >
                  {key}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full w-full">
                No Data to Display
              </div>
            )}
          </div>

          {/* RIGHT side */}
          <div className="w-full h-full grid grid-cols-3 gap-2 ">
            <div className="col-span-2 overflow-auto  shadow space-y-4">
              <div className="w-full max-h-[85%] min-h-[85%] h-[85%]  border border-[#fafafa] rounded p-2 bg-white overflow-auto">
                {isLoading || tableLoader ? (
                  <div className="flex justify-center items-center h-screen">
                    <LuLoader
                      size={32}
                      className="animate-spin ease-out duration-2000"
                    />
                  </div>
                ) : transactions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50">
                      <tr>
                        {tableHeaders.map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-center bg-black text-white"
                            style={{ width: "40%" }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 ">
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction._id}
                          className="hover:bg-gray-100 text-[11px] text-center"
                        >
                          <td className="py-4 px-2">{transaction._id}</td>
                          <td
                            title={transaction.from_address}
                            className="cursor-pointer"
                            // onClick={() =>
                            //   copyToClipboard(transaction.from_address)
                            // }
                          >
                            <a
                              href={`https://etherscan.io/address/${transaction?.from_address}`}
                              target="_blank"
                            >
                              {`${transaction?.from_address?.slice(
                                0,
                                4
                              )}...${transaction?.from_address?.slice(
                                38,
                                42
                              )}`}{" "}
                              <BsBoxArrowUpRight className="inline-icon" />
                            </a>
                          </td>
                          <td
                            style={{ width: "15%" }}
                            title={transaction.to_address}
                            className="cursor-pointer"
                            // onClick={() =>
                            //   copyToClipboard(transaction.to_address)
                            // }
                          >
                            <a
                              href={`https://etherscan.io/address/${transaction?.to_address}`}
                              target="_blank"
                            >
                              {`${transaction.to_address.slice(
                                0,
                                4
                              )}...${transaction.to_address.slice(
                                38,
                                42
                              )}`}{" "}
                              <BsBoxArrowUpRight className="inline-icon" />
                            </a>
                          </td>
                          <td>{transaction.gas}</td>
                          <td>{transaction.value}</td>
                          <td>{transaction.status}</td>
                          <td
                            className="cursor-pointer"
                            // onClick={() =>
                            //   copyToClipboard(transaction.transaction_hash)
                            // }
                          >
                            <a
                              href={`https://etherscan.io/tx/${transaction?.transaction_hash}`}
                              target="_blank"
                            >
                              {`${transaction?.transaction_hash?.slice(
                                0,
                                4
                              )}...${transaction?.transaction_hash?.slice(
                                38,
                                42
                              )}`}{" "}
                              <BsBoxArrowUpRight className="inline-icon" />
                            </a>
                          </td>
                          <td>
                            {moment(transaction?.createdAt).format("lll")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {calculation[0] && calculation[0].gas_sum && (
                        <>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                              Total Records:
                            </td>
                            <td
                              colSpan="1"
                              className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900"
                            >
                              {transactions.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                              Total Gas:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900">
                              {calculation[0].gas_sum}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                              Total Value:
                            </td>
                            <td
                              colSpan="1"
                              className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900"
                            >
                              {calculation[0].value_sum}
                            </td>
                          </tr>
                        </>
                      )}
                    </tfoot>
                  </table>
                ) : (
                  <span className="text-gray-500 flex justify-center items-center h-full">
                    No data available.
                  </span>
                )}
              </div>
              {transactions.length > 0 && (
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
                      disabled={page === Math.ceil(totalItems / pageSize)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* VOLUME */}
            <div className="w-full rounded p-2 bg-[#ffff] shadow flex flex-col gap-2">
              <div className="grid xl:grid-cols-2 gap-2">
                <div className="border p-2 flex justify-between items-center rounded">
                  <div>Number Of Buyers :</div>
                  <span>{buyVolume.number_of_buyer || 0}</span>
                </div>
                <div className="border p-2 flex justify-between items-center rounded">
                  <div>Number Of Sellers :</div>
                  <span>{sellVolume.number_of_seller || 0}</span>
                </div>
              </div>
              <div className="border p-2 flex justify-between items-center rounded flex-wrap">
                <div>Net Volume :</div>
                <span className="truncate" title={netVolume}>
                  {netVolume}
                </span>
              </div>
              <div className="border p-2 flex justify-between items-center rounded flex-wrap">
                <div>Buy Volume :</div>
                <span className="truncate" title={buyVolume.value}>
                  {buyVolume.value || 0}
                </span>
              </div>
              <div className="border p-2 flex justify-between items-center rounded flex-wrap">
                <div>Sell Volume :</div>
                <span className="truncate" title={sellVolume.value}>
                  {sellVolume.value || 0}
                </span>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LuLoader
                    size={32}
                    className="animate-spin ease-out duration-2000"
                  />
                </div>
              ) : volume ? (
                <div className="shadow-sm">
                  <div className="card mb-2">
                    <h6 className="card-title text-center">
                      {volume?.contract_address?.slice(0, 6)}
                      {volume?.contract_address?.slice(0, 6)}
                      <button
                        className="mx-2"
                        // onClick={() => copyToClipboard(volume.contract_address)}
                      >
                        <BsCopy className="inline-icon" />
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${volume.contract_address}`}
                        target="_BLANK"
                      >
                        <BsBoxArrowUpRight className="inline-icon" />
                      </a>
                    </h6>
                    <div className="card-body">
                      <table className="table-data table">
                        {console.log(`volume`, volume)}
                        <tr>
                          <th className="capitalize">Total Supply :</th>
                          <td className="">{volume?.total_supply}</td>
                        </tr>
                        <tr>
                          <th className="capitalize">Circulating Supply :</th>
                          <td className="">{volume?.circulating_supply}</td>
                        </tr>
                        <tr>
                          <th className="capitalize">Reserve 1:</th>
                          <td className="">{volume.reserve_1}</td>
                        </tr>
                        <tr>
                          <th className="capitalize">Reserve 2:</th>
                          <td className="">{volume.reserve_2}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="text-right"></td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="flex justify-center items-center h-full text-gray-500"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Transaction Details</h2>
            <p>
              <strong>TX Hash:</strong> {selectedTransaction.transaction_hash}
            </p>
            <p>
              <strong>Chain ID:</strong> {selectedTransaction.chain_id}
            </p>
            <p>
              <strong>Contract Address:</strong>{" "}
              {selectedTransaction.contract_address || "No Contract Address"}
            </p>
            <p>
              <strong>From Address:</strong> {selectedTransaction.from_address}
            </p>
            <p>
              <strong>To Address:</strong> {selectedTransaction.to_address}
            </p>
            <p>
              <strong>Created At:</strong> {selectedTransaction.createdAt}
            </p>
            <p>
              <strong>Updated At:</strong> {selectedTransaction.updatedAt}
            </p>
            <p>
              <strong>Gas Fee:</strong> ${selectedTransaction.gas}
            </p>
            <p>
              <strong>Value:</strong> ${selectedTransaction.value}
            </p>
            <button
              onClick={closeModal}
              className="px-4 py-2 mt-4 rounded-md load-more-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Contract Modal */}
      {isModalOpen2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Add Contract Address</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter Contract Address"
                value={contractAddress}
                onChange={handleContractAddressChange}
                className="px-4 py-2 border border-gray-300 rounded-md w-100"
              />
              <input
                type="submit"
                value="Submit"
                className="btn btn-primary mx-2 colored-btn mt-4"
              />
              <button
                onClick={closeContractModal}
                className="btn btn-primary bg-red mt-4"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
      {/* TELEGRAM Modal */}
      {telegramModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Add Telegram Alerts</h2>
            <form
              onSubmit={handleTELEGRAMSubmit}
              className="flex flex-col gap-2"
            >
              <select
                className="w-full p-2"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              >
                <option value={"Field3"}>field_name</option>
                <option value={"Field1"}>Field1</option>
                <option value={"Field2"}>Field2</option>
              </select>
              <div className="flex flex-col gap-2 justify-center items-center p-2 border border-gray-300 rounded-md">
                <span>Range</span>
                <div className="flex justify-between gap-4">
                  <input
                    placeholder="from"
                    type="number"
                    value={fromValue}
                    min={0}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                  />
                  <input
                    placeholder="to"
                    type="number"
                    min={0}
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value)}
                    className="w-[50%] h-[40px] p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md w-100"
              />
              {/* Buttons */}
              <div className="flex w-full">
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary mx-2 colored-btn mt-4 w-full"
                />
                <button
                  onClick={() => setTelegramModal(false)}
                  className="btn btn-primary bg-red mt-4 w-full"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

{
  /* <div className="container mt-2 filter-box">
        <div className="row">
          <div className="mb-2 col-md-6">
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={startDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date & Time"
              className="mb-2 px-4 py-2 mr-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className="mb-2 col-md-6">
            <input
              type="text"
              placeholder="Search by TX Hash"
              value={filterTxHash}
              onChange={(e) => setFilterTxHash(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-2 col-md-6">
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
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className="mb-2 col-md-6">
            <select
              value={SelectedcontractAddress}
              onChange={(e) => handleContractAddress(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="" selected>
                Search by Contract Address
              </option>
              {allContractAddresses.map((key, value) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-2">
          <div className="mb-2 col-md-4"></div>
          <div className="mb-2 col-md-4 text-center">
            <button
              onClick={handleSearch}
              className="mr-2 btn btn-primary white-btn"
            >
              Apply Filters
            </button>
            <button
              onClick={clearSelections}
              className="btn btn-primary white-btn"
            >
              Clear
            </button>
          </div>
          <div className="mb-2 col-md-4"></div>
        </div>
      </div> */
}

{
  /* <div className="container mt-4">
        <div className="row table-responsive">
          {transactions?.map((tx, index) => (
            <div className="col-md-3">
              <div class="card mb-2">
                <h6 className="card-title text-center">
                  {tx.transaction_hash.slice(0, 6)}...
                  {tx.transaction_hash.slice(35, 42)}
                  <button
                    className="mx-2"
                    onClick={() => copyToClipboard(tx.transaction_hash)}
                  >
                    <BsCopy className="inline-icon" />
                  </button>
                  <a
                    href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                    target="_BLANK"
                  >
                    <BsBoxArrowUpRight className="inline-icon" />
                  </a>
                </h6>
                <div class="card-body">
                  <table class="table-data table">
                    <tr>
                      <th>Buy Volume</th>
                      <td>3.5 $</td>
                    </tr>
                    <tr>
                      <th>Sell Volume</th>
                      <td>3.5 $</td>
                    </tr>
                    <tr>
                      <th>Net Volume</th>
                      <td>3.66$</td>
                    </tr>
                    <tr>
                      <th>From Address</th>
                      <td>
                        {tx.from_address.slice(0, 4)}...
                        {tx.from_address.slice(38, 42)}
                        <a
                          className="arrow-link"
                          onClick={() => copyToClipboard(tx.from_address)}
                        >
                          <BsCopy className="inline-icon" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>To Address</th>
                      <td>
                        {tx.to_address.slice(0, 4)}...
                        {tx.to_address.slice(38, 42)}
                        <a
                          className="arrow-link"
                          onClick={() => copyToClipboard(tx.to_address)}
                        >
                          <BsCopy className="inline-icon" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Gass Fee</th>
                      <td>{tx.gas}$</td>
                    </tr>
                    <tr>
                      <th>Transaction Value</th>
                      <td>${tx.value}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="text-right">
                        <a
                          onClick={() => handleActionClick(tx)}
                          className="arrow-link"
                        >
                          <BsArrowRightSquareFill className="inline-icon arrow-icon" />
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row text-center mt-2 mb-4">
          <button className="btn btn-primary load-more-btn">Load More</button>
        </div>
      </div> */
}
