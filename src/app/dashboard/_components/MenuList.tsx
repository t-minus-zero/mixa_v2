"use client"

import { useState } from 'react';

const MenuList = ({ list }) => {
    const [selection, setSelection] = useState(list[0].name);

    return (
    <div className="flex flex-row items-center justify-center gap-4">
        <ul className="flex flex-row items-center justify-center gap-4">
            {list.map((item, index) => (
            <li
                key={item.url}
                onClick={() => setSelection(item.name)}
                className={`flex flex-row items-center justify-start leading-5 transition-all duration-300 ease-in-out cursor-pointer text-sm text-zinc-700 ${
                selection === item.name ? 'font-bold' : ''
                }`}
            >
                <a>{item.name}</a>
            </li>
            ))}
        </ul>
    </div>
);
};

export default MenuList;
