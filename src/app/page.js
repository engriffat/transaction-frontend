"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BsCopy } from "react-icons/bs";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const totalItems = transactions.length;
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTxHash, setFilterTxHash] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [allContractAddresses, setallContractAddresses] = useState([]);
  const [SelectedcontractAddress, setcontractAddress] = useState("");
  const [contractAddress, setContractAddress] = useState('');
  const [page, setPage] = useState(1);
  console.log("🚀 ~ Home ~ page:", page)
  const [pageSize, setPageSize] = useState(10);

  // Sorting function
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortedField) {
      const compareResult = a[sortedField].localeCompare(b[sortedField]);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    }
    return 0;
  });

  // Filtering function
  const filterTransactions = () => {
    return sortedTransactions.filter(tx => {
      const txDate = new Date(tx.createdAt); // Assuming createdAt is the property containing transaction time
      const isWithinDateRange =
        (!startDate || txDate >= startDate) &&
        (!endDate || txDate <= endDate);
      const matchesTxHash = tx.transaction_hash.includes(filterTxHash);
      const matchesContractAddress = SelectedcontractAddress === "" || tx.contract_address.includes(SelectedcontractAddress);
      return isWithinDateRange && matchesTxHash && matchesContractAddress;
    });
  };


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
  };

  // const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied!');
    } catch (err) {
      console.error('Unable to copy to clipboard.', err);
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

  // get all contract address from Api
  useEffect(() => {
    const fetchData = async () => {
      // const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const apiUrl = "http://44.221.66.45:3003";
      // console.log(apiUrl);
      try {
        const response = await fetch(`${apiUrl}/api/getContract`);
        const result = await response.json();
        const addresses = result.data.map(item => item.contract_address);
        setallContractAddresses(addresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchData();
  }, []);

  const getTransactions = async () => {
    const apiUrl = "http://44.221.66.45:3003";
    try {
      const response = await fetch(`${apiUrl}/api/getTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contract_address: "",
          // from_date:,
          // to_date:,
          sorting: "",
          sorting_field: "",
          trx_hash: filterTxHash,
          limit: pageSize,
          page_number: page,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data = await response.json();
      setTransactions(data.data); // Assuming the transaction data is returned as an array
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [pageSize, page]); // Empty dependency array means this effect runs once after the initial render

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://44.221.66.45:3003/api/addContract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contract_address: contractAddress
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add contract address');
      }

      const data = await response.json();
      toast.success(data.Message); // Show success message
      setContractAddress(''); // Clear input field
      setIsModalOpen2(false); // Close modal
    } catch (error) {
      toast.error('Error adding contract address:', error);
      // Handle error appropriately (show error message, etc.)
    }
  };

  const handleSearch = () => {
    getTransactions();
  }

  const handleFieldChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <main className="mx-auto text-black container-fluid">
      <div className='container-fluid main-banner'>
        <h2 className='banner-header'>Transaction Bot</h2>
        <div className='row button-row'>
          <div className='mb-2 col-md-10'></div>
          <div className='mb-2 col-md-2'>
            <button className='py-2 rounded-md w-100 white-btn' onClick={() => openContractModal()}>Add Contract</button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className='container-fluid'>
        <div className='row'>
          <div className='mb-2 col-md-4'>
            <input
              type="text"
              placeholder="Search by TX Hash"
              value={filterTxHash}
              onChange={e => setFilterTxHash(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className='mb-2 col-md-4'>
            <select
              value={SelectedcontractAddress}
              onChange={e => handleContractAddress(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="" selected>Search by Contract Address</option>
              {allContractAddresses.map((key, value) => (
                <option key={key} value={key}>
                  {key}</option>
              ))}
            </select>
          </div>
          {/* <div className='mb-2 col-md-2'>
            <select
              value={sortedField}
              onChange={e => setSortedField(e.target.value)}
              className="py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="">Sort By</option>
              <option value="txHash">TX Hash</option>
              <option value="time">Time</option>
            </select>
          </div> */}
          {/* <div className='mb-2 col-md-2'>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div> */}
          <div className='mb-2 col-md-4'>
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={startDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onChange={date => setStartDate(date)}
              placeholderText="Start Date & Time"
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className='mb-2 col-md-4'>
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date & Time"
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className='mb-2 col-md-2'>
            <button onClick={handleSearch} className="py-2 text-white rounded-md w-100 bg-clr">Search</button>
          </div>
          <div className='mb-2 col-md-2'>
            <button onClick={clearSelections} className="py-2 text-white rounded-md w-100 bg-clr">Clear</button>
          </div>
        </div>

        <div className='row table-responsive'>
          <table className="table table-hover table-record">
            <thead>
              <tr>
                <th className="">Updated At</th>
                <th className="">TX Hash</th>
                <th className="">Created At</th>
                {/* <th className="">Chain ID</th> */}
                {/* <th className="">Contract Address</th> */}
                <th className="">From Address</th>
                <th className="">To Address</th>
                <th className="">Gas Fee</th>
                <th className="">Value</th>
                <th className="">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {transactions?.map((tx, index) => (
                <tr key={index}>
                  <td className="">{tx.updatedAt}</td>
                  <td className="">
                    {tx.transaction_hash.slice(0, 4)}...{tx.transaction_hash.slice(38, 42)}
                    <button className='mx-2' onClick={() => copyToClipboard(tx.transaction_hash)}><BsCopy className='inline-icon' /></button>
                    <a href={`https://etherscan.io/tx/${tx.transaction_hash}`} target='_BLANK'><BsBoxArrowUpRight className='inline-icon' /></a>
                  </td>
                  <td className="">{tx.createdAt}</td>
                  {/* <td className="">{tx.chain_id}</td> */}
                  {/* <td className="">{tx.contract_address.slice(0, 15) || "No Contract Address"}</td> */}
                  <td className="">
                    {/* {tx.from_address.slice(0, 15)} */}
                    {tx.from_address.slice(0, 4)}...{tx.from_address.slice(38, 42)}
                    <button className='mx-2' onClick={() => copyToClipboard(tx.from_address)}><BsCopy className='inline-icon' /></button>
                  </td>
                  <td className="">
                    {/* {tx.to_address.slice(0, 15)} */}
                    {tx.to_address.slice(0, 4)}...{tx.to_address.slice(38, 42)}
                    <button className='mx-2' onClick={() => copyToClipboard(tx.to_address)}><BsCopy className='inline-icon' /></button>
                  </td>
                  <td className="">${tx.gas}</td>
                  <td className="">${tx.value}</td>
                  <td className="">
                    <button
                      onClick={() => handleActionClick(tx)}
                      className="text-blue-500 underline cursor-pointer"
                    >
                      <Image src="/assets/images/view.png" alt='Icon' width={20} height={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='tbl-pagination-wrapper'>
            <div className='pagination-limit-wrapper'>
              <span>Show </span>
              <select value={pageSize} onChange={handleFieldChange}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span> entries</span>
            </div>
            <div className='flex gap-5'>
              <button className='cursor-pointer' onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
              <span>{page}</span>
              <button className='cursor-pointer' onClick={() => handlePageChange(page + 1)} disabled={page === Math.ceil(totalItems / pageSize)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Transaction Details</h2>
            <p>Volume detail etc comming soon</p>
            {/* <p><strong>TX Hash:</strong> {selectedTransaction.transaction_hash}</p>
            <p><strong>Chain ID:</strong> {selectedTransaction.chain_id}</p>
            <p><strong>Contract Address:</strong> {selectedTransaction.contract_address || "No Contract Address"}</p>
            <p><strong>From Address:</strong> {selectedTransaction.from_address}</p>
            <p><strong>To Address:</strong> {selectedTransaction.to_address}</p>
            <p><strong>Created At:</strong> {selectedTransaction.createdAt}</p>
            <p><strong>Updated At:</strong> {selectedTransaction.updatedAt}</p>
            <p><strong>Gas Fee:</strong> ${selectedTransaction.gas}</p>
            <p><strong>Value:</strong> ${selectedTransaction.value}</p> */}
            <button onClick={closeModal} className="px-4 py-2 mt-4 text-white rounded-md bg-clr">Close</button>
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
              <input type="submit" value="Submit" className="py-2 mt-2 text-white rounded-md w-50 bg-clr" />
              <button onClick={closeContractModal} className="px-4 py-2 mt-2 mt-4 text-white rounded-md bg-red">Close</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
