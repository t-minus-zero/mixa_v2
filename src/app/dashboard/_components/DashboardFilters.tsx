"use client"

import TitleMenu from "./TitleMenu";

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

export default DashboardFilters;