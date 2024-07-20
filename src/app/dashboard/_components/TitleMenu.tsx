"use client"

import React, { useState } from 'react';

const TitleMenu: React.FC = () => {
const [selection, setSelection] = useState<string>('Projects');

  const items = ['Projects', 'Apps', 'Design Systems', 'Components', 'Collections'];

  return (
    <div className="flex flex-row items-center justify-between gap-4 mt-4">
    <ul className="flex flex-row items-center justify-center gap-4">
        {items.map((item, index) => (
        <li
            key={item}
            onClick={() => setSelection(item)}
            className={`flex flex-row items-center justify-start leading-5 transition-all duration-300 ease-in-out cursor-pointer text-sm text-zinc-700 ${
            selection === item ? 'font-bold' : ''
            }`}
        >
            <a>{item}</a>
        </li>
        ))}
    </ul>
    </div>
  );
};

export default TitleMenu;
