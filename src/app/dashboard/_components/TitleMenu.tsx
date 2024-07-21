"use client"

import { useState } from 'react';
import RadioList from './RadioList';
import MenuList from './MenuList';

const TitleMenu: React.FC = () => {
const [selection, setSelection] = useState<string>('Projects');

  return (
    <div className="w-full flex flex-col items-start justify-center gap-4">
      <h1 className="text-5xl font-bold text-zinc-800">
        Library
      </h1>
      <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <RadioList list={[{name:"Library", url:"dashboard"}, {name:"Collection", url:"dashboard"}]} />
            <div className="flex flex-row items-center justify-start text-zinc-200 text-xl font-thin leading-5 select-none">
                /
            </div>
            <MenuList list={[{name:"Mix", url:"dashboard"}]} />
          </div>
          <div className="flex flex-row items-center gap-4">
            <MenuList list={[{name:"Last Modified", url:"dashboard/"}, {name:"Deleted", url:"dashboard"},]} />
            <RadioList list={[{name:"Cards", url:"dashboard"}, {name:"List", url:"dashboard"}]} />
          </div>
      </div>
    </div>
  );
};

export default TitleMenu;
