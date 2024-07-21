"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const RadioList = ({ list }) => {
  const [selection, setSelection] = useState(list[0].name);
  const [position, setPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`li[data-item='${selection}']`);
      if (selectedElement) {
        const padding = parseInt(window.getComputedStyle(selectedElement).paddingLeft) + parseInt(window.getComputedStyle(selectedElement).paddingRight);
        const elementWidth = selectedElement.offsetWidth;
        const elementLeft = selectedElement.offsetLeft;
        setPosition(elementLeft);
        setWidth(elementWidth);
      }
    }
  }, [selection]);

  return (
    <div className="relative flex bg-zinc-100 rounded-full p-1">
    <div className="relative flex">
      <div className="absolute w-full h-full">
        <div
          id="selector-radio"
          style={{ transform: `translateX(${position}px)`, width: `${width}px` }}
          className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
        />
      </div>
      <ul className="flex flex-row items-center justify-center rounded-full z-10" ref={listRef}>
        {list.map((item) => (
          <li
            key={item.url}
            data-item={item.name}
            onClick={() => setSelection(item.name)}
            className={`p-2 flex flex-row items-center justify-center leading-5 transition-all duration-300 ease-in-out cursor-pointer text-sm font-semibold text-zinc-700 ${
              selection === item.name ? 'text-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Link href={`/${item.url}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default RadioList;
