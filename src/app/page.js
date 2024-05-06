"use client";
import React, { useState } from "react";
import TransactionsComponent from "./component/transactions";
import LivePair from "./component/live-pair";

export default function Home() {
   const [tab, setTab] = useState(1);

   const handleTabClick = (index) => {
      setTab(index);
   };

   return (
      <div className="w-full">
         <div className="bg-white flex justify-center items-center pt-[30px]">
            <span
               onClick={() => handleTabClick(0)}
               className={`p-2 border mr-2 cursor-pointer w-full max-w-[200px] font-bold text-sm text-center rounded-md ${
                  tab === 0 ? "bg-black text-white" : ""
               } `}
            >
               Transaction
            </span>
            <span
               onClick={() => handleTabClick(1)}
               className={`p-2 w-full max-w-[200px] border cursor-pointer font-bold text-sm text-center rounded-md ${
                  tab === 1 ? "bg-black text-white" : ""
               } `}
            >
               Live Pair
            </span>
         </div>
         {tab === 0 ? <TransactionsComponent /> : <LivePair />}
      </div>
   );
}
