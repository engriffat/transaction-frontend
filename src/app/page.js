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
import axios from 'axios';

// Sample transaction data
const transactions = [
  { txHash: '0x7aB3a1B7F4b41De88fEC1Fb179f2eD06C4E1B345', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-01-11 12:00:00', gasFee: 0.002345, value: 1.2345, action: 'send' },
  { txHash: '0x3d3D5388Af89d1a31bE81b3CC0C6F781FF0F7b4E', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', time: '2024-02-13 12:10:00', gasFee: 0.001234, value: 0.5678, action: 'receive' },
  { txHash: '0x7cD7c57BBf5C277bf2986eD806c54C0e2D3f7367', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-03-15 12:30:00', gasFee: 0.003456, value: 2.3456, action: 'send' },
  { txHash: '0x9Fb3644c8B9A27C1147a8E7b926Aa019C7AA8A7d', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-04-16 13:00:00', gasFee: 0.002345, value: 1.2345, action: 'receive' },
  { txHash: '0x3Ee8272578B4b65e7aC1A72e6b3E7E45b92FAB53', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-05-18 13:30:00', gasFee: 0.001234, value: 0.5678, action: 'send' },
  { txHash: '0xE83AB4562E46b7A0481A23Ce7681c0F90380DdE2', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-06-17 14:00:00', gasFee: 0.003456, value: 2.3456, action: 'receive' },
  { txHash: '0x5d3ABcEc4e0162a48F3b4FE314479Cf5E5061676', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-07-12 14:30:00', gasFee: 0.002345, value: 1.2345, action: 'send' },
  { txHash: '0x48Cf3956C50517F0e5cF34CeCe60Ea714eA201bE', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', time: '2024-08-01 15:00:00', gasFee: 0.001234, value: 0.5678, action: 'receive' },
  { txHash: '0x4B7a9015c94a56A81b9b68dbd99B4C0e1D1553B8', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-09-03 15:30:00', gasFee: 0.003456, value: 2.3456, action: 'send' },
  { txHash: '0x8AaF674EEb890D68A977A8d54a16A6f33Ef5AC5a', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-10-17 16:00:00', gasFee: 0.002345, value: 1.2345, action: 'receive' },
  { txHash: '0x33a1D7314a0889759f0F59F36BC5f250D4f01E12', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', time: '2024-11 05:30:00', gasFee: 0.001234, value: 0.5678, action: 'send' },
  { txHash: '0x70FE9b077D9714eC3e030EA2b690e3eBAf8f6059', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-12-17 17:00:00', gasFee: 0.003456, value: 2.3456, action: 'receive' },
  { txHash: '0x17b7E3E143a89c90c25d7B2c85e33DAD67da0D98', toAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-02-17 17:30:00', gasFee: 0.002345, value: 1.2345, action: 'send' },
  { txHash: '0xAb20993Bc481177ec7E8f571ceCaE8A9e22C02db', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-02-17 18:00:00', gasFee: 0.001234, value: 0.5678, action: 'receive' },
  { txHash: '0x4aE7A18cDe7d1824F7B62F6C1F38a30c6Aa49bbF', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-02-17 18:30:00', gasFee: 0.003456, value: 2.3456, action: 'send' },
  { txHash: '0xaB20993Bc481177ec7E8f571ceCaE8A9e22C02db', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-02-17 19:00:00', gasFee: 0.002345, value: 1.2345, action: 'receive' },
  { txHash: '0x5aB20993Bc481177ec7E8f571ceCaE8A9e22C02db', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-02-17 19:30:00', gasFee: 0.001234, value: 0.5678, action: 'send' },
  { txHash: '0x3A1B7F4b41De88fEC1Fb179f2eD06C4E1B3457aB', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-02-17 20:00:00', gasFee: 0.003456, value: 2.3456, action: 'receive' },
  { txHash: '0x1B7F4b41De88fEC1Fb179f2eD06C4E1B3457aB3A', toAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', fromAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', time: '2024-02-17 20:30:00', gasFee: 0.002345, value: 1.2345, action: 'send' },
  { txHash: '0xB7F4b41De88fEC1Fb179f2eD06C4E1B3457aB3A1', toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', fromAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', time: '2024-02-17 21:00:00', gasFee: 0.001234, value: 0.5678, action: 'receive' },
];

export default function Home() {
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
      const txDate = new Date(tx.time);
      const isWithinDateRange =
        (!startDate || txDate >= startDate) &&
        (!endDate || txDate <= endDate);
      const matchesTxHash = tx.txHash.includes(filterTxHash);
      return isWithinDateRange && matchesTxHash;
    });
  };

  // Function to handle click on action (Open modal)
  const handleActionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen1(true);
  };

  // Function to open add contract modal
  const openContractModal =()=>{
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

  // get all contract address from Api
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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


  return (
    <main className="container-fluid mx-auto text-black">
      <div className='container-fluid main-banner'>
        <h2 className='banner-header'>Transaction Bot</h2>
        <div className='row button-row'>
          <div className='col-md-10 mb-2'></div>
          <div className='col-md-2 mb-2'>
            <button className='py-2 w-100 white-btn rounded-md' onClick={() => openContractModal()}>Add Contract</button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-4 mb-2'>
            <input
              type="text"
              placeholder="Search by TX Hash"
              value={filterTxHash}
              onChange={e => setFilterTxHash(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            />
          </div>
          <div className='col-md-4 mb-2'>
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
          <div className='col-md-4 mb-2'>
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
        </div>
        <div className='row'>
          <div className='col-md-3 mb-2'>
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
          <div className='col-md-3 mb-2'>
            <select
              value={sortedField}
              onChange={e => setSortedField(e.target.value)}
              className="py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="">Sort By</option>
              <option value="txHash">TX Hash</option>
              <option value="time">Time</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className='col-md-3 mb-2'>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className='col-md-3 mb-2'>
            <button onClick={clearSelections} className="py-2 w-100 text-white bg-clr rounded-md">Clear</button>
          </div>
        </div>
        <div className='row table-responsive'>
          <table className="table table-hover table-record">
            <thead>
              <tr>
                <th className="">TX Hash</th>
                <th className="">Contract Address</th>
                <th className="">To Address</th>
                <th className="">From Address</th>
                <th className="">Time</th>
                <th className="">Gas Fee</th>
                <th className="">Value</th>
                <th className="">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {filterTransactions().map((tx, index) => (
                <tr key={index}>
                  <td className="">
                    {tx.txHash.slice(0, 4)}...{tx.txHash.slice(38,42)} 
                    <button onClick={() => copyToClipboard(tx.txHash)}><BsCopy className='inline-icon' /></button>

                    
                     <a href= {`https://etherscan.io/tx/${tx.txHash}`} target='_BLANK'><BsBoxArrowUpRight className='inline-icon' /></a>
                  </td>
                  <td className="">{tx.toAddress.slice(0, 15)}</td>
                  <td className="">{tx.toAddress.slice(0, 15)}</td>
                  <td className="">{tx.fromAddress.slice(0, 15)}</td>
                  <td className="">{tx.time}</td>
                  <td className="">${tx.gasFee}</td>
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
        </div>
      </div>

      {/* View Detail Modal */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Transaction Details</h2>
            <p><strong>TX Hash:</strong> {selectedTransaction.txHash}</p>
            <p><strong>To Address:</strong> {selectedTransaction.toAddress}</p>
            <p><strong>From Address:</strong> {selectedTransaction.fromAddress}</p>
            <p><strong>Time:</strong> {selectedTransaction.time}</p>
            <p><strong>Gas Fee:</strong> ${selectedTransaction.gasFee}</p>
            <p><strong>Value:</strong> ${selectedTransaction.value}</p>
            <button onClick={closeModal} className="px-4 py-2 mt-4 text-white bg-clr rounded-md">Close</button>
          </div>
        </div>
      )}
      {/* Contract Modal */}
      {isModalOpen2 && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Add Contract Address</h2>
            <form>
              <input type='' placeholder='Enter Contract Address' className='px-4 py-2 border border-gray-300 rounded-md w-100'/>
              <input type="submit" value="Submit" className='mt-2 py-2 w-50 text-white bg-clr rounded-md'/> <button onClick={closeContractModal} className="mt-2 px-4 py-2 mt-4 text-white bg-red rounded-md">Close</button>
            </form>
          </div>
      </div>
      )}
    </main>
  );
}
