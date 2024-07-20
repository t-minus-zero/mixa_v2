"use client"

import React, { useState, useEffect } from 'react';
import TitleMenu from './_components/TitleMenu';
import MixCard from './_components/MixCard';


const DashboardFilters = () => {

  return (
    <div
      style={{maxWidth: "1440px"}}  
      className="w-full flex flex-row items-start justify-between gap-4 mt-52 mb-6">
        <TitleMenu />
        <ul className="flex flex-row items center justify-center gap-4">
          <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
              <a className="cursor-pointer"> Last Modified </a>
          </li>
          <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
                <a className="cursor-pointer"> Deleted </a>
            </li>
          <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
              <a className="cursor-pointer"> Cards </a>
          </li>
          <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
              <a className="cursor-pointer"> List </a>
          </li>
        </ul>
    </div>
  );
}


export default function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen flex items-center flex-col overflow-hidden">
      <div className="w-full flex items-center flex-col px-4">
        <DashboardFilters />
        <div
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
          className="w-full grid gap-12">
          {Array(36).fill(null).map((_, index) => (
            <div style={{gridColumn: index === 0 ? "span 2": "span 1" }}>
              <MixCard key={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
