import Link from "next/link";
import React from "react";

export default function Index() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-3">
        <div className='container-fluid main-banner'>
          <h2 className='banner-header'>Transaction Bot</h2>
        </div>
        <div className="flex justify-center">
          <Link href="/transactions" className="px-6 py-4 bg-[#09788fff] rounded-lg">Go To Transactions</Link>
        </div>
      </div>
    </div>
  );
}