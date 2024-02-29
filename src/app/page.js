import Link from "next/link";
import React from "react";

export default function Index() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-3">
        <div className='container-fluid main-banner'>
          <h2 className='banner-header'>Transaction Bot</h2>
        </div>
        <div className='row'>
          <div className='col-md-3 mb-2'>
            <select
              value={SelectedcontractAddress} 
              onChange={e => handleContractAddress(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-100"
            >
              <option value="" selected>Search by Contract Address</option>
              {contractAddresses.map((key, value) => (
               <option key={key.address} value={key.address}>
               {key.address}</option>
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
        <div className="flex justify-center">
          <Link href="/transactions" className="px-6 py-4 bg-[#09788fff] rounded-lg">Go To Transactions</Link>
        </div>
      </div>
    </div>
  );
}