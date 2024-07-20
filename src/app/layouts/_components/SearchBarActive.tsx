"use client"


import React, { useState, useEffect } from 'react';

const SearchBarActive = () => {
  const [open, setOpen] = useState(true);
  const [selection, setSelection] = useState('apps');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <div id="" className={` ${open ? 'translate-y-0' : '-translate-y-24'} absolute flex flex-row items-center justify-center px-2 text-zinc-200 text-xl leading-5 select-none transition-all duration-300 ease-in-out`}>
        <ul className="flex flex-row items-center justify-start gap-4">
          <li className="flex flex-row items-center justify-start text-sm text-zinc-900 leading-5">
          <a onClick={() => setSelection('components')}
                className={` ${selection=== 'components' ? 'font-bold' : 'font-normal'} cursor-pointer`}> 
                Public
            </a>
          </li>
          <li className="flex flex-row items-center justify-start text-sm text-zinc-900 leading-5">
            <a onClick={() => setSelection('apps')}
                className={` ${selection=== 'apps' ? 'font-bold' : 'font-normal'} cursor-pointer`}> 
                Mine 
            </a>
          </li>
        </ul>
      </div>
      <div 
        className={` ${open ? 'translate-y-24' : 'translate-y-0'} flex flex-row items-center justify-center transition-all duration-300 ease-in-out`}>
        <button className= {` ${open ? 'w-96 h-16 px-4' : 'w-48 h-12 pl-4 pr-2'} bg-white backdrop-blur-md relative flex flex-col items-center justify-center py-2 rounded-full gap-2 border border-zinc-200 transition-all duration-300 ease-in-out`}>
          <p className="self-start text-sm text-zinc-700 leading-5"> {open ? 'Search' : 'Explore'} </p>
          <span className={` ${open ? 'self-end' : 'self-end'} absolute flex flex-row items-center rounded-full`}>
            <p className= {` ${open ? 'bg-zinc-900 w-10 h-10 font-bold text-sm text-zinc-50' : 'bg-zinc-50 w-8 h-8 text-xs text-zinc-900'} flex flex-row items-center justify-center rounded-full leading-5`}> O </p>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchBarActive;